import React, { useState } from "react";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { FormTitle, InputField, Label } from "../formComponents/FormGeneric";
import { colors } from "../../config/colors";
import agent from "../../utils/agent";
import { Loader } from "../generic";
import { useNotification } from "../actionNotification/NotificationProvider";
import { useRequestByIdQuery } from "../../utils/hooks/serverHooks";
import { FaTimes } from "react-icons/fa";
import { formatCurrency, getClientIdForPlatform } from "../../utils/helpers";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 700px;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  position: relative;
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

const DetailHeader = styled.div`
  margin-left: 5px;
  font-weight: 600;
  grid-column: 1/3;
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
  & > span {
    color: ${({ theme }) => theme.brand};
  }
`;
const DetailsTableBalances = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  background-color: ${({ theme }) => theme.primary};
  padding: 10px;
  border-radius: 5px;
`;

const HighlightSpan = styled.span`
  color: ${({ theme }) => theme.brand};
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

const DetailsTable = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  background-color: ${({ theme }) => theme.primary};
  padding: 10px;
  border-radius: 5px;
`;

function ChangeAccountLeverageRequestModal({ requestId, closeModal }) {
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const { isLoading, data } = useRequestByIdQuery(requestId);

  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const [selectedBrand] = useSelectedBrand();

  const updateRequest = useMutation(
    ({ requestId, action, rejectionReason }) =>
      agent().updateClientRequest(requestId, action, rejectionReason),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([selectedBrand, "pendingRequests"]);
        closeModal();
        data?.data?.request?.status === "reject"
          ? actionNotification.WARNING(
              `Request rejected. Reason: ${data?.data?.request?.metadata?.rejection_reason}`
            )
          : actionNotification.SUCCESS("Account leverage changed successfully");
      },
      onError: (error) => {
        actionNotification.ERROR(error.response.data.message);
      },
      mutationKey: ["updateRequest", requestId],
    }
  );
  return (
    <Outer>
      {isLoading && <Loader />}
      <TitleRow>
        <div />
        <FormTitle>Change Account Leverage</FormTitle>
        <BtnsContainer>
          <BtnClose onClick={() => closeModal()}>
            <FaTimes />
          </BtnClose>
        </BtnsContainer>
      </TitleRow>
      <UserDetails>
        User: {data?.user?.title} {data?.user?.first_name}{" "}
        {data?.user?.last_name}
        <span>
          {data?.user &&
            getClientIdForPlatform(data?.user, data?.account?.platform)}
        </span>
      </UserDetails>
      <DetailHeader>
        Request is for <HighlightSpan>{data?.account?.platform}</HighlightSpan>{" "}
        account <HighlightSpan>{data?.account?.login_id}</HighlightSpan>
      </DetailHeader>
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
        <Details>Account type:</Details>
        <Details>{data?.account?.account_type}</Details>
        <Details>Group:</Details>
        <Details>{data?.account?.group}</Details>
      </DetailsTable>
      <DetailHeader>User comments</DetailHeader>
      <Details>{data?.request?.metadata?.description}</Details>

      <DetailHeader>Action</DetailHeader>
      <Details>
        Change leverage from <span>1:{data?.account?.leverage}</span> to
        <span>1:{data?.request?.metadata?.leverage}</span>
      </Details>

      <Label>Reason for rejection</Label>
      <InputField
        type="text"
        placeholder="Add reason for rejection"
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
              {x === "approve" && (
                <Btns
                  onClick={() => updateRequest.mutate({ requestId, action: x })}
                >
                  Approve
                </Btns>
              )}
              {x === "reject" && (
                <Btns
                  onClick={() => {
                    if (reason.length < 3) {
                      setErrorMsg(true);
                    } else {
                      updateRequest.mutate({
                        requestId,
                        action: x,
                        rejectionReason: reason,
                      });
                    }
                  }}
                  isDisabled={reason.length < 3}
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

export default ChangeAccountLeverageRequestModal;
