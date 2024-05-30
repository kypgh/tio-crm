import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import styled from "styled-components";

import { FaTimes } from "react-icons/fa";
import { getGatewayByID } from "../../config/paymentGateways";
import agent from "../../utils/agent";
import { formatCurrency, getClientIdForPlatform } from "../../utils/helpers";
import { useRequestByIdQuery } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { useNotification } from "../actionNotification/NotificationProvider";
import { FormTitle, InputField, Label } from "../formComponents/FormGeneric";
import { Loader } from "../generic";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 700px;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  position: relative;
  color: ${({ theme }) => theme.white};
`;

const DescContainer = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textPrimary};
  padding: 15px;
  border-radius: 5px;
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

const BtnClose = styled.div`
  margin-left: auto;
  max-width: 100px;
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

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* max-width: 300px; */
  width: 100%;
  margin: auto;
  gap: 10px;
  padding-bottom: 10px;

  & > *:not(strong) {
    flex: 1;
  }
`;

const UserDetails = styled.div`
  display: flex;
  gap: 10px;
  background-color: ${({ theme }) => theme.primary};
  padding: 10px;
  border-radius: 5px;
  & span {
    color: ${({ theme }) => theme.brand};
  }
`;

const DetailHeader = styled.div`
  grid-column: 1/3;
  margin-left: 5px;
  font-weight: 600;
`;
const Details = styled.div`
  background-color: unset;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 3px 10px;
  width: 100%;
  color: ${({ theme }) => theme.white};
  min-height: 27px;
  overflow: hidden;
  display: flex;
  gap: 5px;
  align-items: center;
`;

const DetailsLine = styled.div`
  background-color: unset;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 3px 10px;
  width: 100%;
  color: ${({ theme }) => theme.white};
  min-height: 27px;
  overflow: hidden;
  gap: 5px;

  & span {
    color: ${({ theme }) => theme.brand};
  }
`;

const DetailsTable = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  background-color: ${({ theme }) => theme.primary};
  padding: 10px;
  border-radius: 5px;
`;

function PendingCryptoDepositModal({ theme, requestId, closeModal }) {
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const { isLoading, data } = useRequestByIdQuery(requestId);

  const [brand] = useSelectedBrand();

  const queryClient = useQueryClient();
  const actionNotification = useNotification();
  const updateRequest = useMutation(
    ({ requestId, action, rejectionReason }) =>
      agent().updateClientRequest(requestId, action, rejectionReason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([brand, "pending-deposits"]);
        closeModal();
        actionNotification.SUCCESS("Deposited Successfully");
      },
      mutationKey: ["updateRequest", requestId],
    }
  );
  return (
    <Outer>
      {isLoading && <Loader />}
      <TitleRow>
        <div />
        <FormTitle>Deposit to Account:</FormTitle>
        <BtnsContainer>
          <BtnClose onClick={() => closeModal()}>
            <FaTimes />
          </BtnClose>
        </BtnsContainer>
      </TitleRow>
      <UserDetails>
        User: {data?.user?.title} {data?.user?.first_name}{" "}
        {data?.user?.last_name}{" "}
        <span>
          {data?.user &&
            getClientIdForPlatform(data?.user, data?.account?.platform)}
        </span>
      </UserDetails>
      <DetailsTable>
        <DetailHeader>Account</DetailHeader>
        <Details>Platform:</Details>
        <Details>{data?.account?.platform}</Details>
        <Details>ID:</Details>

        <Details>{data?.account?.login_id}</Details>
        <Details>Balance:</Details>

        <Details>
          {data?.account &&
            formatCurrency(data?.account?.balance, data?.account?.currency)}
        </Details>
      </DetailsTable>
      <DetailsTable>
        <DetailHeader>Transaction details</DetailHeader>
        <Details>Payment Method:</Details>
        <Details>
          {getGatewayByID(data?.transaction?.payment_method).title ??
            data?.transaction?.payment_method}
        </Details>
        <Details>ID:</Details>
        <Details>{data?.account?.login_id}</Details>
        <Details>Balance:</Details>
        <Details>
          {data?.account &&
            formatCurrency(data?.account?.balance, data?.account?.currency)}
        </Details>
        <Details style={{ gridColumn: "1/3" }}>
          <a
            href={`https://app.bitgo.com/0/0/transactions/transfer/${data?.transaction?.bitgoTransferId}?wallet=${data?.transaction?.bitgoWalletId}&coin=${data?.transaction?.bitgoCoin}`}
            target="_blank"
            rel="noreferrer"
          >
            Click here View tranasaction in bitgo
          </a>
        </Details>
      </DetailsTable>
      <DetailsLine>
        Deposited Amount:{" "}
        <span>
          {data?.transaction &&
            formatCurrency(
              data?.transaction?.amount,
              data?.transaction?.currency
            )}
        </span>{" "}
        &#40;approx.{" "}
        {data?.transaction &&
          formatCurrency(data?.transaction?.processed_usd_amount, "USD")}
        &#41;
      </DetailsLine>

      <Label>Reason for rejection</Label>
      <InputField
        placeholder="Add reason for rejection"
        type="text"
        onChange={(e) => {
          setReason(e.target.value);
          setErrorMsg(false);
        }}
      />
      {errorMsg && <Error>Reason must be at least 3 characters</Error>}
      <BtnsContainer>
        {updateRequest.isLoading ? (
          <Loader />
        ) : (
          data?.request?.actions?.map((x, idx) => (
            <React.Fragment key={idx}>
              {x === "processed" && (
                <Btns
                  onClick={() => updateRequest.mutate({ requestId, action: x })}
                >
                  Process
                </Btns>
              )}
              {x === "reject" && (
                <Btns
                  onClick={() => {
                    if (reason.length <= 3) {
                      setErrorMsg(true);
                    } else {
                      updateRequest.mutate({
                        requestId,
                        action: x,
                        rejectionReason: reason,
                      });
                    }
                  }}
                  isDisabled={reason.length <= 3}
                >
                  Reject
                </Btns>
              )}
            </React.Fragment>
          ))
        )}
      </BtnsContainer>
    </Outer>
  );
}

export default PendingCryptoDepositModal;
