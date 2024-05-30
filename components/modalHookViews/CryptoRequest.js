import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  FormTitle,
  Label,
  InputField,
  Select,
} from "../formComponents/FormGeneric";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import { Loader } from "../generic";
import PCR from "../PCR";
import { useRouter } from "next/router";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Outer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
  max-width: 700px;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  position: relative;
  font-size: 16px;
`;

const DescContainer = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textPrimary};
  padding: 3px 10px;
  border-radius: 5px;
`;

const Field = styled.div`
  width: calc(50% - 15px);
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const BtnsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Btns = styled.div`
  max-width: 100px;
  width: 100%;
  padding: 10px;
  text-align: center;
  color: ${({ theme }) => theme.white};
  border-radius: 5px;
  background-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.errorMsg : theme.primary};
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
`;

const Error = styled.div`
  color: ${({ theme }) => theme.errorMsg};
  font-size: 14px;
`;

const CryptoRequest = ({ data, closeModal }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [delayedReason, setDelayedReason] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [isRejected, setIsRejected] = useState(data.status === "reject");
  const [isDelayed, setIsDelayed] = useState(data.status === "delayed");
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState(data.status);

  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const [selectedBrand] = useSelectedBrand();

  const notificationMessages = {
    approve: "Withdrawal request approved",
    reject: "Withdrawal request rejected",
    delayed: "Withdrawal request delayed",
  };

  const updateRequest = useMutation(
    ({ requestId, action, rejectionReason, delayedReason }) =>
      agent().updateClientRequest(
        requestId,
        action,
        rejectionReason,
        delayedReason
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "clientRequests"]);
        queryClient.invalidateQueries([selectedBrand, "pendingWithdrawals"]);
        closeModal();
        actionNotification.SUCCESS(notificationMessages[selectedStatus]);
      },
      mutationKey: ["updateRequest", data._id],
    }
  );

  useEffect(() => {
    if (selectedStatus === "rejected") {
      setDelayedReason(null);
    }
    if (selectedStatus === "delayed") {
      setRejectReason(null);
    }
  }, [selectedStatus]);

  if (updateRequest.isLoading) {
    return <Loader />;
  }

  return (
    <Outer>
      <FormTitle style={{ width: "100%" }}>Crypto Request</FormTitle>
      <Field>
        <Label>Client ID</Label>
        <DescContainer>{data.user.ctrader_id}</DescContainer>
      </Field>
      <Field>
        <Label>Email</Label>
        <DescContainer>{data.user.email}</DescContainer>
      </Field>
      <Field>
        <Label>First Name</Label>
        <DescContainer>{data.user.first_name}</DescContainer>
      </Field>
      <Field>
        <Label>Last Name</Label>
        <DescContainer>{data.user.last_name}</DescContainer>
      </Field>
      <Field>
        <Label>Address</Label>
        <DescContainer>{data.metadata?.details?.address}</DescContainer>
      </Field>
      <Field>
        <Label>Amount</Label>
        <DescContainer>{data.metadata?.amount}</DescContainer>
      </Field>
      <Field>
        <Label>Currency</Label>
        <DescContainer>{data.metadata?.currency}</DescContainer>
      </Field>
      <PCR.withdrawFromAccountStatus>
        <Field>
          <Label>Status</Label>
          <Select
            style={{ textTransform: "capitalize" }}
            defaultValue={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setRejectReason("");
              setDelayedReason("");
            }}
          >
            <option value={data.status} disabled>
              {data.status}
            </option>
            {!isRejected &&
              data.actions
                .filter((action) => action !== "processed")
                .map((el, idx) => (
                  <option key={idx} value={el}>
                    {el}
                  </option>
                ))}
          </Select>
        </Field>
        {selectedStatus === "reject" && (
          <>
            <Label style={{ width: "100%" }}>Reason for Rejection</Label>
            {isRejected ? (
              <DescContainer style={{ width: "100%" }}>
                {data.metadata.reject_reason}
              </DescContainer>
            ) : (
              <InputField
                type="text"
                placeholder={"Enter reason..."}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  setErrorMsg(false);
                }}
              />
            )}
          </>
        )}
        {selectedStatus === "delayed" && (
          <>
            <Label style={{ width: "100%" }}>Reason for Delayed</Label>
            {isDelayed ? (
              <DescContainer style={{ width: "100%" }}>
                {data.metadata.delayed_reason}
              </DescContainer>
            ) : (
              <InputField
                type="text"
                placeholder={"Enter reason..."}
                onChange={(e) => {
                  setDelayedReason(e.target.value);
                  setErrorMsg(false);
                }}
              />
            )}
          </>
        )}
        {errorMsg && <Error>Reason must be at least 3 characters</Error>}
        <BtnsContainer>
          {!isRejected && (
            <Btns
              isDisabled={
                (selectedStatus === "reject" && rejectReason?.length <= 3) ||
                (selectedStatus === "delayed" && delayedReason?.length <= 3) ||
                selectedStatus === "pending"
              }
              onClick={() => {
                if (selectedStatus === "reject" && rejectReason?.length <= 3) {
                  setErrorMsg(true);
                  return;
                }
                if (
                  selectedStatus === "delayed" &&
                  delayedReason?.length <= 3
                ) {
                  setErrorMsg(true);
                  return;
                }
                if (selectedStatus === "pending") return;
                updateRequest.mutate({
                  requestId: data._id,
                  action: selectedStatus,
                  rejectionReason: rejectReason,
                  delayedReason,
                });
              }}
            >
              Save
            </Btns>
          )}
          <Btns onClick={() => closeModal()}>Cancel</Btns>
        </BtnsContainer>
      </PCR.withdrawFromAccountStatus>
    </Outer>
  );
};

export default CryptoRequest;
