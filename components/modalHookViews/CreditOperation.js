import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import styled, { useTheme } from "styled-components";

import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import {
  Details,
  ErrorMessage,
  FormTitle,
  InputField,
  Select,
} from "../formComponents/FormGeneric";
import { ActionButton, NumberInput } from "../generic";
import { CURRENCY_SYMBOLS } from "../../config/currencies";
import { formatCurrency } from "../../utils/helpers";
import { useExchangeRates } from "../../utils/hooks/serverHooks";

const Outer = styled.div`
  max-width: 700px;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  padding: 40px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 150px;
  position: relative;
  font-size: 16px;
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

const LineSeperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* max-width: 300px; */
  width: 100%;
  margin: auto;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.primary};

  & > *:not(strong) {
    flex: 1;
  }
`;

const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
  & > :first-child {
    margin-left: 5px;
  }
  & > * {
    width: 100%;
  }
`;

const CreditOperation = ({ account, closeModal }) => {
  const theme = useTheme();
  const actionNotification = useNotification();
  const [operation, setOperation] = useState({
    amount: "",
    type: "deposit",
    reason: "",
    customReason: "",
    payment_method: "",
  });

  const [from, setFrom] = useState(account.currency || "USD");
  const [errorMsg, setErrorMsg] = useState("");

  const currenciesArr = Object.keys(CURRENCY_SYMBOLS);

  const isDisabled =
    operation.amount <= 0 || operation.reason === "" || operation.type === "";

  const updateBlanace = useMutation(
    ({ amount, type, reason, payment_method }) =>
      agent().updateCredit(account._id, {
        amount,
        type: type,
        reason: reason,
        payment_method: payment_method,
      }),
    {
      onSuccess: () => {
        actionNotification.SUCCESS("Balance updated!");
        setErrorMsg("");
        closeModal();
      },
      onError: (error) => {
        actionNotification.ERROR("Something went wrong!");
        setErrorMsg(error.message);
        console.error(error.message);
      },
    }
  );

  const { data } = useExchangeRates(from, account.currency);

  return (
    <Outer>
      <FormTitle>Credit Operation</FormTitle>
      <Line>
        <Details
          style={{
            backgroundColor: "unset",
            border: `1px solid ${theme.primary}`,
          }}
        >
          <strong>Account Type: </strong>
          {account.account_type}
        </Details>
        <Details
          style={{
            backgroundColor: "unset",
            border: `1px solid ${theme.primary}`,
          }}
        >
          <strong>Balance: </strong>
          {formatCurrency(account.balance, account.currency)}
        </Details>
      </Line>
      <Line>
        <Details
          style={{
            backgroundColor: "unset",
            border: `1px solid ${theme.primary}`,
          }}
        >
          <strong>Bonus Balance: </strong>
          {formatCurrency(account.bonus_balance, account.currency)}
        </Details>
        <Details
          style={{
            backgroundColor: "unset",
            border: `1px solid ${theme.primary}`,
          }}
        >
          <strong>Leverage: </strong>
          {account.leverage}
        </Details>
      </Line>
      <Line>
        <Details
          style={{
            backgroundColor: "unset",
            border: `1px solid ${theme.primary}`,
          }}
        >
          <strong>Used Margin: </strong>
          {formatCurrency(account.used_margin, account.currency)}
        </Details>
        <Details
          style={{
            backgroundColor: "unset",
            border: `1px solid ${theme.primary}`,
          }}
        >
          <strong>Withdrawal Hold: </strong>
          {formatCurrency(account.withdrawal_hold, account.currency)}
        </Details>
      </Line>
      <LineSeperator>
        <Details
          style={{
            backgroundColor: "unset",
            border: `1px solid ${theme.primary}`,
          }}
        >
          <strong>Currency: </strong>
          {account.currency}
        </Details>
        <Details
          style={{
            backgroundColor: "unset",
            border: `1px solid ${theme.primary}`,
          }}
        >
          <strong>Environment Type: </strong>
          {account.environment_type}
        </Details>
      </LineSeperator>
      <LineSeperator>
        <InputLabel>
          <strong>Type</strong>
          <Select
            value={operation.type}
            onChange={(e) =>
              setOperation((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </Select>
        </InputLabel>
        <InputLabel>
          <strong>Reason</strong>
          <Select
            value={operation.reason}
            onChange={(e) => {
              setOperation((prev) => ({
                ...prev,
                reason: e.target.value,
              }));
            }}
          >
            <option value="" disabled>
              Select Reason
            </option>
            <option value="30%282">30%282</option>
            <option value="BONUS:23NY2023">BONUS: 23NY2023</option>
            <option value="BONUS:25bonus01">BONUS: 25bonus01</option>
            <option value="BONUS:25bonus07">BONUS: 25bonus07</option>
            <option value="BONUS:30%BONUS">BONUS: 30%BONUS</option>
            <option value="BONUS:adrollbonus01">BONUS: adrollbonus01</option>
            <option value="BONUS:birthday-present">
              BONUS: birthday-present
            </option>
            <option value="BONUS:changemybroker">BONUS: changemybroker</option>
            <option value="BONUS:Forex Bonus">BONUS: Forex Bonus</option>
            <option value="BONUS:Friend">BONUS: Friend</option>
            <option value="BONUS:Nodeposit01">BONUS: Nodeposit01</option>
            <option value="BONUS:Scratch card">BONUS: Scratch card</option>
            <option value="BONUS:Signature-offer">
              BONUS: Signature-offer
            </option>
            <option value="BONUS:VIPBlack1k">BONUS: VIPBlack1k</option>
            <option value="BONUS:VIPFriday01">BONUS: VIPFriday01</option>
            <option value="BONUS:VIPFriday01">BONUS: VIPFriday01</option>
            <option value="BONUS:VIPFriday01">BONUS: VIPFriday01</option>
            <option value="BONUS:PRIME50">BONUS: PRIME50</option>
            <option value="BONUS:50%DEP01">BONUS: 50%DEP01</option>
            <option value="TK20">TK20</option>
            <option value="WEBINAR">WEBINAR</option>
            <option value="Other">Other</option>
          </Select>
        </InputLabel>
      </LineSeperator>
      <LineSeperator>
        <InputLabel>
          <strong>Amount</strong>
          <NumberInput
            value={operation.amount}
            placeholder="0"
            onChange={(e) =>
              setOperation((prev) => ({ ...prev, amount: e.target.value }))
            }
          />
        </InputLabel>
        <InputLabel>
          <strong>Currency</strong>
          <Select
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
            }}
          >
            {currenciesArr.map((currency) => (
              <option key={currency} value={currency}>
                {`${currency} (${CURRENCY_SYMBOLS[currency]})`}
              </option>
            ))}
          </Select>
        </InputLabel>
        <InputLabel>
          <strong>Converted Amount</strong>
          <Details
            isLoading={!data}
            style={{
              backgroundColor: "unset",
              color: theme.brand,
              border: `1px solid ${theme.primary}`,
            }}
          >
            {formatCurrency(operation.amount * data?.rate, account.currency)}
          </Details>
        </InputLabel>
      </LineSeperator>
      {operation.reason === "Other" && (
        <LineSeperator>
          <InputLabel>
            <strong>Custom Reason:</strong>
            <InputField
              smallStyles
              placeholder={"Reason"}
              value={operation.customReason}
              onChange={(e) =>
                setOperation((prev) => ({
                  ...prev,
                  customReason: e.target.value,
                }))
              }
            />
          </InputLabel>
        </LineSeperator>
      )}
      <ActionButton
        invert
        inactive={isDisabled || updateBlanace.isLoading || !data}
        style={{ maxWidth: "100px", margin: "auto" }}
        onClick={() =>
          updateBlanace.mutate({
            amount: parseFloat(operation.amount) * data?.rate,
            type: operation.type,
            reason:
              operation.reason === "Other"
                ? operation.customReason
                : operation.reason,
            payment_method: operation.payment_method,
          })
        }
      >
        Confirm
      </ActionButton>
      {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
    </Outer>
  );
};

export default CreditOperation;
