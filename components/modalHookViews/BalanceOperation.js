import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import styled, { useTheme } from "styled-components";

import { CURRENCY_SYMBOLS } from "../../config/currencies";
import { getGatewaysForBrand } from "../../config/paymentGateways";
import agent from "../../utils/agent";
import { formatCurrency } from "../../utils/helpers";
import { useExchangeRates } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { useNotification } from "../actionNotification/NotificationProvider";
import {
  Details,
  ErrorMessage,
  FormTitle,
  InputField,
  Select,
} from "../formComponents/FormGeneric";
import { ActionButton, NumberInput } from "../generic";

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

const BalanceOperation = ({ account, closeModal }) => {
  const theme = useTheme();
  const [selectedBrand] = useSelectedBrand();
  const paymentGateways = getGatewaysForBrand(selectedBrand);

  const actionNotification = useNotification();
  const [operation, setOperation] = useState({
    amount: "",
    type: "deposit",
    reason: "",
    payment_method: "",
  });

  const [from, setFrom] = useState(account.currency || "USD");
  const [to, setTo] = useState(account.currency);
  const [errorMsg, setErrorMsg] = useState("");

  const currenciesArr = Object.keys(CURRENCY_SYMBOLS);

  const isDisabled =
    operation.amount <= 0 ||
    operation.reason === "" ||
    operation.payment_method === "" ||
    operation.type === "";

  const updateBlanace = useMutation(
    () =>
      agent().updateBalance(account._id, {
        ...operation,
        amount: operation.amount * data.rate,
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
      },
    }
  );

  const { data } = useExchangeRates(from, to);

  return (
    <Outer>
      <FormTitle>Balance Operation</FormTitle>
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
          <strong>Method</strong>
          <Select
            onChange={(e) => {
              setOperation((v) => ({
                ...v,
                payment_method: e.target.value,
              }));
            }}
            value={operation.payment_method}
          >
            <option value="" disabled>
              Select Method
            </option>
            {paymentGateways.map(({ id, title }) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </Select>
        </InputLabel>
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
          <strong>Converted Amount </strong>
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
      <LineSeperator>
        <InputLabel>
          <strong>Reason</strong>
          <InputField
            smallStyles
            placeholder={"Reason"}
            value={operation.reason}
            onChange={(e) =>
              setOperation((prev) => ({ ...prev, reason: e.target.value }))
            }
          />
        </InputLabel>
      </LineSeperator>
      <ActionButton
        invert
        inactive={isDisabled || updateBlanace.isLoading || !data}
        style={{ maxWidth: "100px", margin: "auto" }}
        onClick={() => updateBlanace.mutate()}
      >
        Confirm
      </ActionButton>
      {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
    </Outer>
  );
};

export default BalanceOperation;
