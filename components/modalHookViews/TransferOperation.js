import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled, { useTheme } from "styled-components";

import { FaArrowRight } from "react-icons/fa";
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

  & > *:not(strong) {
    flex: 1;
  }
`;

const LineSeperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  /* max-width: 300px; */
  width: 100%;
  margin: auto;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.primary};

  & > * {
    flex: 1 1;
  }
`;

const DetailHeader = styled.h4`
  text-align: center;
  font-size: 18px;
  text-decoration: underline;
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

const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
`;

const Exchange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const AccountSelect = ({ userId, label, value, onChange }) => {
  const accQuery = useQuery({
    queryKey: [userId, "accountSelect", "live"],
    queryFn: () =>
      agent()
        .getClientAccounts(userId, "live", 1, 1000)
        .then((res) => res.data),
  });
  return (
    <InputLabel>
      <strong>{label}</strong>
      <Select
        value={value}
        onChange={(e) => {
          const account = accQuery?.data?.docs?.find(
            (acc) => acc._id === e.target.value
          );
          onChange(e.target.value, account);
        }}
      >
        <option>Select account</option>
        {accQuery.data?.docs?.map((account) => (
          <option key={account._id} value={account._id}>
            {account.platform} {account.login_id} &#40;
            {account.currency} {account.balance}&#41;
          </option>
        ))}
      </Select>
    </InputLabel>
  );
};

const TransferOperation = ({ userId, accountFromDefault, closeModal }) => {
  const theme = useTheme();
  const actionNotification = useNotification();

  const [accountFrom, setAccountFrom] = useState(accountFromDefault);
  const [accountTo, setAccountTo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const [selectedBrand] = useSelectedBrand();
  const transferMutation = useMutation(
    ({ amount, accountFrom, accountTo, reason }) =>
      agent().transferBetweenAccounts({
        accountFrom,
        accountTo,
        amount,
        reason,
      }),

    {
      onSuccess: () => {
        actionNotification.SUCCESS("Funds transfered succesfuly!");
        queryClient.invalidateQueries([
          selectedBrand,
          "clientAccounts",
          userId,
          "live",
        ]);
        setErrorMsg("");
        closeModal();
      },
      onError: (error) => {
        actionNotification.ERROR("Something went wrong!");
        setErrorMsg(error.message);
      },
    }
  );

  const { data: exchangeRate, isLoading: exchangeRateIsLoading } =
    useExchangeRates(accountFrom?.currency, accountTo?.currency);
  return (
    <Outer>
      <FormTitle>Transfer Operation</FormTitle>
      <Line>
        <AccountSelect
          userId={userId}
          label="Account From"
          value={accountFrom?._id}
          filter={(acc) => acc._id !== accountTo?._id}
          onChange={(id, account) => {
            setAccountFrom(account);
          }}
        />
        <AccountSelect
          userId={userId}
          label="Account To"
          value={accountTo?._id}
          filter={(acc) => acc._id !== accountFrom?._id}
          onChange={(id, account) => {
            setAccountTo(account);
          }}
        />
      </Line>
      <Line>
        <AccountDetails>
          <Details>
            <strong>Account Type: </strong>
            {accountFrom.account_type}
          </Details>
          <Details>
            <strong>Balance: </strong>
            {formatCurrency(accountFrom.balance, accountFrom.currency)}
          </Details>
          <Details>
            <strong>Bonus Balance: </strong>
            {formatCurrency(accountFrom.bonus_balance, accountFrom.currency)}
          </Details>
          <Details>
            <strong>Leverage: </strong>
            {accountFrom.leverage}
          </Details>
          <Details>
            <strong>Used Margin: </strong>
            {formatCurrency(accountFrom.used_margin, accountFrom.currency)}
          </Details>
          <Details>
            <strong>Withdrawal Hold: </strong>
            {formatCurrency(accountFrom.withdrawal_hold, accountFrom.currency)}
          </Details>
        </AccountDetails>
        <AccountDetails>
          <Details>
            <strong>Account Type: </strong>
            {accountTo?.account_type}
          </Details>
          <Details>
            <strong>Balance: </strong>
            {accountTo && formatCurrency(accountTo.balance, accountTo.currency)}
          </Details>
          <Details>
            <strong>Bonus Balance: </strong>
            {accountTo &&
              formatCurrency(accountTo.bonus_balance, accountTo.currency)}
          </Details>
          <Details>
            <strong>Leverage: </strong>
            {accountTo?.leverage}
          </Details>
          <Details>
            <strong>Used Margin: </strong>
            {accountTo &&
              formatCurrency(accountTo.used_margin, accountTo.currency)}
          </Details>
          <Details>
            <strong>Withdrawal Hold: </strong>
            {accountTo &&
              formatCurrency(accountTo.withdrawal_hold, accountTo.currency)}
          </Details>
        </AccountDetails>
      </Line>
      <LineSeperator>
        <InputLabel>
          <strong>Amount From &#40;{accountFrom?.currency}&#41;</strong>
          <NumberInput
            value={amount}
            placeholder="0"
            onChange={(e) => setAmount(e.target.value)}
          />
        </InputLabel>
        <Exchange>
          <small>Rate:</small> &#126;{exchangeRate?.rate.toFixed(5)}
          <FaArrowRight size={16} />
        </Exchange>
        <InputLabel>
          <strong>
            Amount To{" "}
            {accountTo?.currency && <>&#40;{accountTo?.currency}&#41;</>}
          </strong>
          <Details
            isLoading={exchangeRateIsLoading}
            style={{
              backgroundColor: "unset",
              color: theme.brand,
              border: `1px solid ${theme.primary}`,
            }}
          >
            {formatCurrency(amount * exchangeRate?.rate, accountTo?.currency)}
          </Details>
        </InputLabel>
      </LineSeperator>
      <LineSeperator>
        <InputLabel>
          <strong>Reason</strong>
          <InputField
            smallStyles
            placeholder={"Reason"}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </InputLabel>
      </LineSeperator>
      <ActionButton
        invert
        inactive={
          amount <= 0 ||
          !accountFrom ||
          !accountTo ||
          !reason ||
          transferMutation.isLoading
        }
        style={{ maxWidth: "100px", margin: "auto" }}
        onClick={() =>
          transferMutation.mutate({
            amount,
            accountFrom: accountFrom._id,
            accountTo: accountTo._id,
            reason,
          })
        }
      >
        Confirm
      </ActionButton>
      {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
    </Outer>
  );
};

export default TransferOperation;
