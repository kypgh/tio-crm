import { DateTime } from "luxon";
import React from "react";
import styled, { useTheme } from "styled-components";

import { ImArrowUp, ImArrowDown } from "react-icons/im";

import { formatCurrency } from "../../utils/helpers";

const Outer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 10px;
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 5px;
`;

const TransactionDetails = styled.div`
  display: flex;
  gap: 10px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  min-width: ${({ not }) => !not && "150px"};
`;

const LabelSpan = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  & p {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 12px;
  }

  & span {
    color: ${({ theme }) => theme.white};
    font-size: 14px;
    text-transform: capitalize;
  }
`;

function FinancesInfo({ transaction }) {
  const theme = useTheme();
  return (
    <Outer>
      <TransactionDetails>
        {transaction?.transaction_type === "deposit" && (
          <ImArrowUp color={theme.success} />
        )}
        {(transaction?.transaction_type === "withdrawal" ||
          transaction?.transaction_type === "payout") && (
          <ImArrowDown color={theme.errorMsg} />
        )}
        <LabelSpan>
          <p>Time:</p>
          <span>
            {" "}
            {DateTime.fromISO(transaction?.createdAt).toFormat(" HH:mm")}
          </span>
        </LabelSpan>
        <LabelSpan>
          <p>Transaction ID:</p>
          <span>{transaction?.transaction_id}</span>
        </LabelSpan>
        <LabelSpan>
          <p>Amount:</p>
          <span>
            {formatCurrency(transaction.amount, transaction.currency)}
          </span>
        </LabelSpan>
        <LabelSpan>
          <p>Currency:</p>
          <span>{transaction?.currency}</span>
        </LabelSpan>
        <LabelSpan>
          <p>Status:</p>
          <span>{transaction?.transaction_status}</span>
        </LabelSpan>
      </TransactionDetails>
    </Outer>
  );
}

export default FinancesInfo;
