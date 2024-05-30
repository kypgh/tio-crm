import React from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FormTitle, Label, Select } from "../formComponents/FormGeneric";
import agent from "../../utils/agent";
import { CurrencyInput, Dropdown, Loader, NumberInput } from "../generic";
import { useNotification } from "../actionNotification/NotificationProvider";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import { WITHDRAWAL_METHODS } from "../../config/enums";
import { formatCurrency } from "../../utils/helpers";
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
`;

const Field = styled.div`
  width: calc(50% - 15px);
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DescContainer = styled.div`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textPrimary};
  padding: 3px 10px;
  border-radius: 5px;
`;

const BtnsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
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

const Btns = styled.button`
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

const ErrorText = styled.div`
  color: ${({ theme }) => theme.errorMsg};
`;

const ProcessWithrdawal = ({ data }) => {
  const queryClient = useQueryClient();
  const actionNotification = useNotification();
  const router = useRouter();

  const [selectedBrand] = useSelectedBrand();

  const processWithdrawal = useMutation(
    ({ requestId, action, methods }) =>
      agent().updateClientRequest(requestId, action, null, null, methods),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "pendingWithdrawals"]);
        closeModal();
        actionNotification.SUCCESS("Withdrawal request processed successfully");
      },
      onError: (err) => {
        actionNotification.ERROR(err.response.data.message);
      },
      mutationKey: ["processRequest", data._id],
    }
  );

  return (
    <Outer>
      {processWithdrawal.isLoading && <Loader />}
      <FormTitle style={{ width: "100%" }}>Process Withdrawal</FormTitle>
      <Field>
        <Label>First Name</Label>
        <DescContainer>{data.user.first_name}</DescContainer>
      </Field>
      <Field>
        <Label>Last Name</Label>
        <DescContainer>{data.user.last_name}</DescContainer>
      </Field>
      <Field>
        <Label>Client ID</Label>
        <DescContainer>{data.user.ctrader_id}</DescContainer>
      </Field>
      <Field>
        <Label>Amount</Label>
        <DescContainer>
          {formatCurrency(data.metadata.amount, data.metadata.currency)}
        </DescContainer>
      </Field>
      <Field>
        <Label>Status</Label>
        <DescContainer>{data.status}</DescContainer>
      </Field>
      {data.status === "delayed" && (
        <Field>
          <Label>Reason</Label>
          <DescContainer>{data.metadata.delayed_reason}</DescContainer>
        </Field>
      )}
      {data.metadata?.details && (
        <>
          {data.metadata?.details?.account_name && (
            <Field>
              <Label>Account Name</Label>
              <DescContainer>
                {data.metadata?.details?.account_name}
              </DescContainer>
            </Field>
          )}
          {data.metadata?.details?.account_number && (
            <Field>
              <Label>Account Number</Label>
              <DescContainer>
                {data.metadata?.details?.account_number}
              </DescContainer>
            </Field>
          )}
          {data.metadata?.details?.bank_address && (
            <Field>
              <Label>Bank Address</Label>
              <DescContainer>
                {data.metadata?.details?.bank_address}
              </DescContainer>
            </Field>
          )}
          {data.metadata?.details?.bic_swift && (
            <Field>
              <Label>BIC Swift</Label>
              <DescContainer>{data.metadata?.details?.bic_swift}</DescContainer>
            </Field>
          )}
          {data.metadata?.details?.iban && (
            <Field>
              <Label>IBAN</Label>
              <DescContainer>{data.metadata?.details?.iban}</DescContainer>
            </Field>
          )}
          {data.metadata?.details?.skrillEmail && (
            <Field>
              <Label>Skrill Email</Label>
              <DescContainer>
                {data.metadata?.details?.skrillEmail}
              </DescContainer>
            </Field>
          )}
          {data.metadata?.details?.netellerEmail && (
            <Field>
              <Label>Neteller email</Label>
              <DescContainer>
                {data.metadata?.details?.netellerEmail}
              </DescContainer>
            </Field>
          )}
        </>
      )}
      <FormContainer>
        <Formik
          initialValues={{
            amount: data.metadata.amount,
            methods: [{ type: "bank_wire", amount: null }],
          }}
          onSubmit={(values) => {
            processWithdrawal.mutate({
              requestId: data._id,
              action: "processed",
              methods: values.methods,
            });
          }}
          validate={(values) => {
            const errors = {};
            const coveredAmount =
              values.amount -
              values.methods.reduce((acc, v) => acc + v.amount, 0);
            if (coveredAmount !== 0) {
              errors.amount =
                "Remaining amount must be " +
                formatCurrency(0, data.metadata.currency);
            }
            return errors;
          }}
        >
          {({ values, touched, errors, handleChange, setFieldValue }) => {
            const availableMethods = WITHDRAWAL_METHODS.filter(
              (method) => values.methods.findIndex((m) => m.type === method) < 0
            );
            return (
              <FormInner>
                {values.methods.map((method, index) => (
                  <MethodRow key={method.type}>
                    <Select
                      style={{ width: "100%" }}
                      name={`methods[${index}].type`}
                      value={method.type}
                      onChange={handleChange}
                    >
                      <option value={method.type}>{method.type}</option>
                      {availableMethods.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </Select>
                    <CurrencyInput
                      autoComplete="off"
                      name={`methods[${index}].amount`}
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
                        { type: availableMethods[0], amount: null },
                      ]);
                    }}
                    type="button"
                  >
                    + Add PSP
                  </Btns>
                )}
                <p>
                  Remaining amount:{" "}
                  {formatCurrency(
                    values.amount -
                      values.methods.reduce(
                        (acc, v) =>
                          acc +
                          (Number(v.amount) !== NaN ? Number(v.amount) : 0),
                        0
                      ),
                    data.metadata.currency
                  )}
                </p>
                {errors.amount && <ErrorText>{errors.amount}</ErrorText>}
                <BtnsContainer>
                  <Btns type="submit">Process</Btns>
                </BtnsContainer>
              </FormInner>
            );
          }}
        </Formik>
      </FormContainer>
    </Outer>
  );
};

export default ProcessWithrdawal;
