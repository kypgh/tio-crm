import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled, { keyframes } from "styled-components";

import { Form, Formik } from "formik";
import { FaCheck, FaExclamationCircle, FaTimes } from "react-icons/fa";
import { CURRENCY_SYMBOLS } from "../../config/currencies";
import {
  getGatewayByID,
  getGatewaysForBrand,
} from "../../config/paymentGateways";
import agent from "../../utils/agent";
import {
  formatCurrency,
  getAccountIdString,
  getClientIdForPlatform,
} from "../../utils/helpers";
import { useRequestByIdQuery } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import useTheme from "../../utils/hooks/useTheme";
import { useNotification } from "../actionNotification/NotificationProvider";
import CreditCard from "../common/CreditCard";
import {
  FormTitle,
  InputField,
  Label,
  Select,
} from "../formComponents/FormGeneric";
import { CurrencyInput, Loader, NumberInput } from "../generic";
import ScrollIntoViewOnRender from "../ScrollIntoViewOnRender";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
  padding: 20px;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
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

const Btns = styled.button`
  all: unset;
  max-width: 120px;
  width: 100%;
  padding: 10px;
  text-align: center;
  color: ${({ theme }) => theme.white};
  font-weight: 600;
  border-radius: 5px;
  background-color: ${({ $bg, theme }) => $bg || theme.primary};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
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

const DetailHeader = styled.div`
  margin-left: 5px;
  font-weight: 600;
  grid-column: span 2;
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

const DetailsTable = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 10px;
`;

const DepositsDetailsTable = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => Math.min(columns, 3)}, 1fr);
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 10px;
`;

const DetailsTableBalances = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  background-color: ${({ theme }) => theme.primary};
  padding: 10px;
  border-radius: 5px;
`;

const BankDetailsTable = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 5px;
  background-color: ${({ theme }) => theme.primary};
  padding: 10px;
  border-radius: 5px;
  & > :nth-child(even) {
    border-left: 2px solid ${({ theme }) => theme.secondary};
    border-radius: 0;
  }
`;

const DepositsDetailsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-column: span ${({ columns }) => Math.min(columns, 3)};
`;

const DepositsDetailsWallet = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 15px;
  border-top: 1px solid ${({ theme }) => theme.primary};
  padding-top: 10px;
`;

const MethodRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 10px;
`;

const FormInner = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DelBtn = styled.button`
  width: 25px;
  height: 25px;
  outline: none;
  background-color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.errorMsg};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.errorMsg}33;
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.errorMsg};
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

const PspError = styled.div`
  border: ${({ theme }) => theme.errorMsg} 1px solid;
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  padding: 5px 10px;
  font-weight: 600;
  font-size: 14px;
`;

const StatusText = styled.div`
  & > span {
    background-color: ${({ theme }) => theme.primary};
    padding: 5px;
    border-radius: 5px;
    color: ${({ theme, $status }) =>
      $status === "approve"
        ? theme.success
        : $status === "reject"
        ? theme.errorMsg
        : theme.pendingColor};
  }
`;

const Shake = keyframes`
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
`;

const WarningBox = styled.div`
  animation: ${Shake} 0.5s;
  border: 1px solid ${({ theme }) => theme.textPrimary};
  border-radius: 5px;
  padding: 10px;
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  gap: 10px;

  & span {
    font-weight: 700;
    color: ${({ theme }) => theme.pendingColor};
  }

  & > svg {
    color: ${({ theme }) => theme.pendingColor};
    margin-top: -3px;
  }
`;

const warnings = {
  tiomarketGigadatInterac: (
    <p>
      <span>Gigadat</span> is automatically handled by the system. Once you
      proccess the request a transaction will be created and sent to Gigadat for
      the specified amount
    </p>
  ),
};

const FeeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

function WarningMsg({ pspsArray = [] }) {
  return pspsArray.map((psp) => {
    if (!warnings.hasOwnProperty(psp.type)) return null;
    return (
      <WarningBox key={psp}>
        <FaExclamationCircle size={28} />
        {warnings[psp.type]}
      </WarningBox>
    );
  });
}

const CURRENCY_STANDARD_FEES = {
  ETH: 0.003,
  BTC: 0.0006,
  USDT: 10,
};

function ProcessWithdrawal({ amount, onSubmit, currency, isLoading }) {
  const { theme } = useTheme();
  const [selectedBrand] = useSelectedBrand();
  const paymentGateways = getGatewaysForBrand(selectedBrand);

  return (
    <FormContainer>
      <Formik
        initialValues={{
          amount: Number(amount),
          methods: [{ type: "", amount: "" }],
          fee: {
            isChecked: CURRENCY_STANDARD_FEES.hasOwnProperty(currency),
            amount: CURRENCY_STANDARD_FEES[currency] ?? 0,
            percent: (
              ((CURRENCY_STANDARD_FEES[currency] ?? 0) / amount) *
              100
            ).toFixed(2),
            reason: "",
          },
        }}
        onSubmit={(values) => {
          if (!isLoading) {
            onSubmit(values);
          }
        }}
        validate={(values) => {
          const errors = {};
          let coveredAmount =
            values.amount -
            values.methods.reduce((acc, v) => acc + v.amount, 0);
          if (values.fee.isChecked) {
            coveredAmount -= values.fee.amount;
          }
          if (Math.abs(coveredAmount) > 0.0001) {
            errors.amount =
              "Remaining amount must be " + formatCurrency(0, currency);
          }
          return errors;
        }}
      >
        {({ values, errors, handleChange, setFieldValue }) => {
          const availableMethods = paymentGateways.filter(
            (method) =>
              values.methods.findIndex((m) => m.type === method.id) < 0
          );

          return (
            <FormInner id="processWithdrawal">
              <WarningMsg pspsArray={values.methods} />

              {values.methods.map((method, index) => (
                <MethodRow key={method.type}>
                  <Select
                    style={{ width: "100%" }}
                    name={`methods[${index}].type`}
                    value={method.type}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select PSP
                    </option>
                    {method.type && (
                      <option value={method.type}>
                        {getGatewayByID(method.type).title}
                      </option>
                    )}
                    {availableMethods.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </Select>
                  <NumberInput
                    autoComplete="off"
                    name={`methods[${index}].amount`}
                    prefix={CURRENCY_SYMBOLS[currency]}
                    value={method.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                  />
                  <DelBtn
                    type="button"
                    onClick={() => {
                      setFieldValue(
                        "methods",
                        values.methods.filter((m) => m.type !== method.type)
                      );
                    }}
                  >
                    X
                  </DelBtn>
                </MethodRow>
              ))}
              {availableMethods.length > 0 && (
                <Btns
                  onClick={() => {
                    setFieldValue("methods", [
                      ...values.methods,
                      { type: availableMethods[0].id, amount: "" },
                    ]);
                  }}
                  type="button"
                >
                  + Add PSP
                </Btns>
              )}
              <div>
                <Btns
                  onClick={() => {
                    setFieldValue("fee.isChecked", !values.fee.isChecked);
                  }}
                  type="button"
                  style={{
                    color: values.fee.isChecked ? theme.errorMsg : theme.brand,
                  }}
                >
                  {values.fee.isChecked ? "- Remove" : "+ Add"} fee
                </Btns>
                {!!CURRENCY_STANDARD_FEES[currency] && (
                  <span style={{ marginLeft: "20px" }}>
                    We usually apply the standard fee of{" "}
                    {CURRENCY_STANDARD_FEES[currency]} {currency} for
                    withdrawals of this currency.
                  </span>
                )}
              </div>
              {values.fee.isChecked && (
                <FeeContainer>
                  <NumberInput
                    autoComplete="off"
                    name={`fee.amount`}
                    prefix={CURRENCY_SYMBOLS[currency]}
                    value={values.fee.amount}
                    onChange={(e) => {
                      setFieldValue(
                        "fee.percent",
                        ((e.target.value / values.amount) * 100).toFixed(2)
                      );
                      handleChange(e);
                    }}
                    placeholder="Fee Amount"
                  />
                  <NumberInput
                    autoComplete="off"
                    name={`fee.percent`}
                    value={values.fee.percent}
                    suffix={"%"}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue(
                        "fee.amount",
                        Number(
                          formatCurrency(
                            (e.target.value / 100) * values.amount,
                            currency,
                            false
                          )
                        )
                      );
                    }}
                    placeholder="Percent"
                    step={0.01}
                    min={0}
                    max={100}
                  />
                  <InputField
                    name="fee.reason"
                    placeholder="Reason"
                    value={values.fee.reason}
                    onChange={handleChange}
                    style={{ gridColumn: "1 / span 2" }}
                  />
                </FeeContainer>
              )}
              <p>
                Remaining amount:{" "}
                {formatCurrency(
                  values.amount -
                    values.methods.reduce(
                      (acc, v) =>
                        acc + (Number(v.amount) !== NaN ? Number(v.amount) : 0),
                      0
                    ) -
                    (values.fee.isChecked ? values.fee.amount : 0),
                  currency
                )}
              </p>
              {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
            </FormInner>
          );
        }}
      </Formik>
    </FormContainer>
  );
}

function WithdrawalRequestModal({ requestId, closeModal }) {
  const [reason, setReason] = useState("");
  const [action, setAction] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [isProccess, setIsProccess] = useState(false);

  const { isLoading, data } = useRequestByIdQuery(requestId);
  const { theme } = useTheme();

  const [pspError, setPspError] = useState("");

  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const [selectedBrand] = useSelectedBrand();

  const updateRequest = useMutation(
    ({ requestId, action, rejectionReason, delayed_reason, methods, fee }) =>
      agent()
        .updateClientRequest(
          requestId,
          action,
          rejectionReason,
          delayed_reason,
          methods,
          fee
        )
        .then(() => agent().getClientsRequestById(requestId))
        .then((res) => res.data),
    {
      onSuccess: (res) => {
        setPspError("");
        actionNotification.SUCCESS("Updated successfully");
        if (["processed", "reject"].includes(res?.request?.status)) {
          closeModal();
        } else {
          queryClient.invalidateQueries([selectedBrand, "requests", requestId]);
          setAction("");
        }
      },
      onError: (error) => {
        actionNotification.ERROR("Error performing operation");
        if (error.response?.data?.message)
          setPspError(error.response?.data?.message);
      },
      mutationKey: ["updateRequest", requestId],
    }
  );
  return (
    <Outer>
      {isLoading && <Loader />}
      <TitleRow>
        <StatusText $status={data?.request?.status}>
          Status: <span>{data?.request?.status}</span>
        </StatusText>
        <FormTitle>Withdrawal:</FormTitle>
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
        Account {getAccountIdString(data?.account)} {"-"}{" "}
        {data?.account?.currency}
      </DetailHeader>
      <DetailsTableBalances>
        <Details style={{ fontWeight: "lighter" }}>Balance</Details>
        <Details style={{ fontWeight: "lighter" }}>Equity</Details>
        <Details style={{ fontWeight: "lighter" }}>Margin</Details>
        <Details style={{ fontWeight: "lighter" }}>Free Margin</Details>
        <Details style={{ fontWeight: "lighter" }}>Withdrawal Hold</Details>
        <Details>
          {data?.account &&
            formatCurrency(data?.account?.balance, data?.account?.currency)}
        </Details>
        <Details>
          {data?.account &&
            formatCurrency(data?.account?.equity, data?.account?.currency)}
        </Details>
        <Details>
          {data?.account &&
            formatCurrency(data?.account?.used_margin, data?.account?.currency)}
        </Details>
        <Details>
          {data?.account &&
            formatCurrency(data?.account?.free_margin, data?.account?.currency)}
        </Details>
        <Details>
          {data?.account &&
            formatCurrency(
              data?.account?.withdrawal_hold,
              data?.account?.currency
            )}
        </Details>
      </DetailsTableBalances>

      <DetailHeader>Request Details</DetailHeader>
      <DetailsTable>
        <Details>Requested Amount</Details>
        <Details>
          {data?.transaction &&
            formatCurrency(
              data?.transaction?.amount,
              data?.transaction?.currency
            )}
        </Details>
        <Details>Account ID</Details>
        <Details>{getAccountIdString(data?.account)}</Details>
        {data?.request?.metadata?.delayed_reason && (
          <>
            <Details style={{ color: theme.pendingColor }}>
              Delay reason:
            </Details>
            <Details>{data?.request?.metadata?.delayed_reason}</Details>
          </>
        )}
      </DetailsTable>
      {!!data?.request?.metadata?.details &&
        (data?.request?.metadata?.type === "crypto" ? (
          <>
            <DetailHeader>Client Wallet Details</DetailHeader>
            <BankDetailsTable>
              <Details style={{ fontWeight: "200" }}>Wallet Address</Details>
              <Details>{data.request?.metadata?.details?.address}</Details>
            </BankDetailsTable>
          </>
        ) : (
          <>
            <DetailHeader>Bank Details</DetailHeader>
            <BankDetailsTable>
              <Details style={{ fontWeight: "200" }}>Account Name</Details>
              <Details>{data.request.metadata.details?.account_name}</Details>
              <Details style={{ fontWeight: "200" }}>Account Number</Details>
              <Details>{data.request.metadata.details?.account_number}</Details>
              <Details style={{ fontWeight: "200" }}>Bank Name</Details>
              <Details>{data.request.metadata.details?.bank_name}</Details>
              <Details style={{ fontWeight: "200" }}>Bank Address</Details>
              <Details>{data.request.metadata.details?.bank_address}</Details>
              <Details style={{ fontWeight: "200" }}>Country</Details>
              <Details>{data.request.metadata.details?.country}</Details>
              <Details style={{ fontWeight: "200" }}>BIC Swift</Details>
              <Details>{data.request.metadata.details?.bic_swift}</Details>
              <Details style={{ fontWeight: "200" }}>IBan</Details>
              <Details>{data.request.metadata.details?.iban}</Details>
            </BankDetailsTable>
          </>
        ))}

      {data?.depositMethods?.length > 0 && (
        <DetailHeader>Previous Deposit Methods</DetailHeader>
      )}
      {data?.depositMethods?.map((method) => (
        <DepositsDetailsTable key={method._id} columns={2}>
          <DepositsDetailsHeader columns={2}>
            <div>
              Method -{" "}
              {getGatewayByID(method.type).title || method.payment_method}
            </div>
            <div>
              Total -{" "}
              {formatCurrency(
                method?.processed_amount,
                method?.processed_currency
              )}
            </div>
          </DepositsDetailsHeader>
          {method.details.map((detail, idx) =>
            detail.card ? (
              <CreditCard
                key={idx}
                expiry={detail.card.card_exp}
                type={detail.card.card_type}
                extra={formatCurrency(
                  detail?.processed_amount,
                  method?.processed_currency
                )}
                number={detail.card.card_number}
                issuer={detail.card.card_issuer_name}
              />
            ) : (
              <DepositsDetailsWallet key={idx}>
                <div>{detail.wallet?.account_identifier}</div>
                <div>
                  {formatCurrency(
                    detail?.processed_amount,
                    method?.processed_currency
                  )}
                </div>
              </DepositsDetailsWallet>
            )
          )}
        </DepositsDetailsTable>
      ))}

      {isProccess && (
        // <ScrollIntoViewOnRender>
        <ProcessWithdrawal
          amount={data?.request?.metadata?.amount}
          currency={data?.account?.currency}
          onSubmit={(v) =>
            updateRequest.mutate({
              requestId: requestId,
              action: "processed",
              methods: v.methods,
              ...(v.fee.isChecked
                ? {
                    fee: {
                      amount: v.fee.amount,
                      reason: v.fee.reason,
                    },
                  }
                : {}),
            })
          }
          isLoading={updateRequest.isLoading}
        />
        // </ScrollIntoViewOnRender>
      )}

      {pspError && <PspError>{pspError}</PspError>}
      <BtnsContainer>
        {updateRequest.isLoading ? (
          <Loader />
        ) : (
          <>
            {data?.request?.status !== "delayed" && (
              <Btns
                $bg="#b18e00"
                type="button"
                onClick={() => {
                  setAction(action === "delayed" ? "" : "delayed");
                  setErrorMsg(false);
                }}
              >
                Delay
              </Btns>
            )}
            {data?.request?.status !== "approve" && (
              <Btns
                $bg="#00cc00"
                type="button"
                onClick={() =>
                  updateRequest.mutate({ requestId, action: "approve" })
                }
              >
                Approve
              </Btns>
            )}

            {data?.request?.status !== "reject" && (
              <Btns
                $bg="#cc0000"
                type="button"
                onClick={() => {
                  setAction(action === "reject" ? "" : "reject");
                  setErrorMsg(false);
                }}
              >
                Reject
              </Btns>
            )}
            {!isProccess && (
              <Btns
                onClick={() => {
                  setIsProccess(true);
                }}
                type="button"
              >
                Start Proccess
              </Btns>
            )}
            {isProccess && (
              <Btns type="submit" form="processWithdrawal">
                Process
              </Btns>
            )}
          </>
        )}
      </BtnsContainer>
      {action === "delayed" && (
        <ScrollIntoViewOnRender>
          <Label>Delay Reason</Label>
          <InputField
            type="text"
            placeholder={"Reason for delay"}
            onChange={(e) => {
              setReason(e.target.value);
              setErrorMsg(false);
            }}
          />
          {errorMsg && (
            <Error>Delay reason must be at least 4 characters</Error>
          )}
          <BtnsContainer>
            <Btns
              onClick={() => {
                if (reason.length <= 3) {
                  setErrorMsg(true);
                } else {
                  updateRequest.mutate({
                    requestId,
                    action: "delayed",
                    delayed_reason: reason,
                  });
                }
              }}
              isDisabled={updateRequest.isLoading || reason.length <= 3}
            >
              <FaCheck color={theme.success} />
            </Btns>

            <Btns
              onClick={() => {
                setAction("");
                setReason("");
                setErrorMsg(false);
              }}
              isDisabled={updateRequest.isLoading}
            >
              <FaTimes color={theme.errorMsg} />
            </Btns>
          </BtnsContainer>
        </ScrollIntoViewOnRender>
      )}
      {action === "reject" && (
        <ScrollIntoViewOnRender>
          <Label>Reject Reason</Label>
          <InputField
            type="text"
            placeholder={"Reason for rejection"}
            onChange={(e) => {
              setReason(e.target.value);
              setErrorMsg(false);
            }}
          />
          {errorMsg && (
            <Error>Reject reason must be at least 4 characters</Error>
          )}
          <BtnsContainer>
            <Btns
              onClick={() => {
                if (reason.length <= 3) {
                  setErrorMsg(true);
                } else {
                  updateRequest.mutate({
                    requestId,
                    action: "reject",
                    rejectionReason: reason,
                  });
                }
              }}
              isDisabled={updateRequest.isLoading || reason.length <= 3}
            >
              <FaCheck color={theme.success} />
            </Btns>

            <Btns
              onClick={() => {
                setAction("");
                setReason("");
                setErrorMsg(false);
              }}
              isDisabled={updateRequest.isLoading}
            >
              <FaTimes color={theme.errorMsg} />
            </Btns>
          </BtnsContainer>
        </ScrollIntoViewOnRender>
      )}
    </Outer>
  );
}

export default WithdrawalRequestModal;
