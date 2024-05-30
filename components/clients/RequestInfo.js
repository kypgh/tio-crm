import React, { useState } from "react";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { colors } from "../../config/colors";
import { ActionButton, Loader } from "../generic";
import { requestTypesMap } from "../../config/enums";
import ConfirmationModal from "../ConfirmationModal";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import { formatCurrency } from "../../utils/helpers";
import ModalHook from "../ModalHook";
import RequestModal from "../requestModals/RequestModal";
import { FaArrowRight } from "react-icons/fa";

const Outer = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  padding: 5px;
  border: 2px solid ${({ theme }) => theme.secondary};
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    border: 2px solid ${({ theme }) => theme.blue};
  }
`;

const RequestLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

const SpanLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
  font-weight: 400;
`;

const FlexIt = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.white};
  font-size: 14px;
`;

const RequestRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-transform: capitalize;
`;

const Status = styled.div`
  color: ${({ theme }) => theme.textSecondary};
`;

export default function RequestInfo({ request }) {
  return (
    <ModalHook
      componentToShow={
        <RequestModal
          requestType={request.request_type}
          requestId={request._id}
        />
      }
    >
      {({ openModal }) => (
        <Outer onClick={() => openModal()}>
          <RequestLeft>
            <FlexIt>
              <SpanLabel>Type:</SpanLabel>
              <p>
                {requestTypesMap[request.request_type] ?? request.request_type}
              </p>
            </FlexIt>
            {request.request_type === "deleteAccount" && (
              <FlexIt>
                <SpanLabel>Description:</SpanLabel>
                <p>{request.metadata.description}</p>
              </FlexIt>
            )}
            {request.request_type === "withdrawFromAccount" && (
              <FlexIt>
                <FlexIt>
                  <SpanLabel>Account ID:</SpanLabel>
                  <p>{request.metadata.account_id}</p>
                </FlexIt>
                <FlexIt>
                  <SpanLabel>Amount:</SpanLabel>
                  <p>
                    {formatCurrency(
                      request.metadata.amount,
                      request.metadata.currency
                    )}
                  </p>
                </FlexIt>
              </FlexIt>
            )}
            {request.request_type === "transferFundsBetweenAccounts" && (
              <FlexIt>
                <FlexIt>
                  <SpanLabel>Account From:</SpanLabel>
                  <p>{request.metadata.accountFrom}</p>
                </FlexIt>
                <FlexIt>
                  <SpanLabel>Account To:</SpanLabel>
                  <p>{request.metadata.accountTo}</p>
                </FlexIt>
                <FlexIt>
                  <SpanLabel>Amount:</SpanLabel>
                  <p>
                    {formatCurrency(
                      request.metadata.amountFrom,
                      request.metadata.currencyFrom
                    )}
                  </p>
                  <FaArrowRight />
                  <p>
                    {formatCurrency(
                      request.metadata.amountTo,
                      request.metadata.currencyTo
                    )}
                  </p>
                </FlexIt>
              </FlexIt>
            )}
          </RequestLeft>
          <RequestRight>
            <Status>{request.status}</Status>
          </RequestRight>
        </Outer>
      )}
    </ModalHook>
  );
}
