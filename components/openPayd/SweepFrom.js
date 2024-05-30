import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField, Select } from "../formComponents/FormGeneric";
import { ActionButton } from "../generic";
import axios from "axios";
import agent, { getJWTToken } from "../../utils/agent";
import _ from "lodash";
import useDebounce from "../../utils/hooks/useDebounce";
import FriendlySelect from "./FriendlySelect";

const Outer = styled.div`
  width: 100%;
  padding: 40px 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  & form {
    max-width: 1000px;
    width: 100%;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    /* justify-content: center; */
    gap: 15px;
    padding: 10px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-width: calc(50% - 10px);
  width: 100%;

  & label {
    color: ${({ theme }) => theme.textPrimary};
    font-weight: 700;
    display: flex;
    align-items: center;
  }

  & span {
    color: ${({ theme }) => theme.errorMsg};
    font-size: 14px;
    font-weight: unset;
    padding-left: 5px;
  }
`;

const BtnWrap = styled.div`
  max-width: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Type = styled.div`
  color: ${({ theme }) => theme.textPrimary};
`;

const validationSchema = Yup.object().shape({
  sweepSourceAccountId: Yup.string().required("Required"),
  linkedAccountHolderId: Yup.string().required("Required"),
  accountId: Yup.string().required("Required"),
  beneficiary: Yup.object()
    .shape({
      bankAccountCountry: Yup.string().required("Required"),
      bankName: Yup.string(),
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      beneficiaryAddressLine: Yup.string(),
      beneficiaryCity: Yup.string(),
      beneficiaryCountry: Yup.string(),
      beneficiaryPostalCode: Yup.string(),
      iban: Yup.string(),
      bic: Yup.string(),
      accountNumber: Yup.string(),
      routingCodes: Yup.object().shape({
        SORT_CODE: Yup.string(),
      }),
    })
    .test(
      "ibanOrAccountNumber",
      "Either IBAN or Account Number is required",
      function (value) {
        if (!value.iban && !value.accountNumber) {
          return this.createError({
            message: "Either IBAN or Account Number is required",
          });
        }
        return true;
      }
    ),
  amount: Yup.object().shape({
    currency: Yup.string().required("Required"),
    value: Yup.number().required("Required"),
  }),
  paymentType: Yup.string().required("Required"),
  reference: Yup.string().required("Required"),
  reasonCode: Yup.string(),
});

const InputToJsx = ({
  name,
  label,
  type = "text",
  placeholder,
  errors = {},
  touched = {},
  ...rest
}) => {
  const err = _.get(errors, name);
  const isTouched = _.get(touched, name);

  return (
    <InputWrapper>
      <label htmlFor={name}>
        {label}
        {err && isTouched && <span>{err}</span>}
      </label>
      <InputField
        name={name}
        id={name}
        type={type}
        placeholder={placeholder || label}
        {...rest}
      />
    </InputWrapper>
  );
};

const FriendlyName = ({ setFieldValue }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [value, setValue] = useState("");

  useDebounce(searchTerm, 500, async (value) => {
    let params;
    if (value) {
      params = {
        friendlyName: value,
      };
    }
    await axios({
      method: "get",
      url: "/api/openPayd/getListLinkedClient",
      headers: {
        authorization: `Bearer ${getJWTToken()}`,
      },
      params,
    })
      .then((res) => {
        setSearchResults(res.data.content);
      })
      .catch(async (err) => {
        if (err?.response?.status === 401) {
          await agent().refreshAccessToken();
        }
      });
  });

  return (
    <InputWrapper>
      <label>Friendly Name</label>
      <InputField
        name="friendlyName"
        id="friendlyName"
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        placeholder="Search.."
      />
    </InputWrapper>
  );
};

const SweepFrom = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/openPayd/getAccounts",
      headers: {
        authorization: `Bearer ${getJWTToken()}`,
      },
    })
      .then((res) => {
        setAccounts(res.data.content);
      })
      .catch(async (err) => {
        if (err?.response?.status === 401) {
          await agent().refreshAccessToken();
          err.config.headers.authorization = `Bearer ${getJWTToken()}`;
          return axios(err.config);
        }
      });
  }, []);

  return (
    <Outer>
      <Formik
        initialValues={{
          sweepSourceAccountId: "",
          linkedAccountHolderId: "",
          accountId: "",
          beneficiary: {
            bankAccountCountry: "",
            bankName: "",
            customerType: "RETAIL", //hardcoded value
            firstName: "",
            lastName: "",
            beneficiaryAddressLine: "",
            beneficiaryCity: "",
            beneficiaryCountry: "",
            beneficiaryPostalCode: "",
            iban: "",
            bic: "",
            accountNumber: "",
            routingCodes: {
              SORT_CODE: "",
            },
          },
          amount: {
            currency: "",
            value: "",
          },
          paymentType: "",
          reference: "",
          reasonCode: "",
        }}
        validationSchema={validationSchema}
        validateOnChange={true}
        validate={(values) => {
          const errors = {};
          const isGBP = values.sweepSourceAccountId
            ? accounts
                .find((account) => account.id === values.sweepSourceAccountId)
                ?.actualBalance.currency.toLowerCase() === "gbp"
            : false;

          if (isGBP) {
            if (!values.beneficiary.routingCodes.SORT_CODE) {
              errors.beneficiary = {
                routingCodes: {
                  SORT_CODE: "Required",
                },
              };
            }
          }

          if (!values.beneficiary.iban && !values.beneficiary.accountNumber) {
            errors.beneficiary = {
              ...errors.beneficiary,
              iban: "Either IBAN or Account Number is required",
              accountNumber: "Either IBAN or Account Number is required",
            };
          }

          return errors;
        }}
        onSubmit={async (values) => {
          await axios
            .post("/api/openPayd/sweepPayout", values, {
              headers: {
                authorization: `Bearer ${getJWTToken()}`,
              },
            })
            .catch(async (err) => {
              if (err?.response?.status === 401) {
                await agent().refreshAccessToken();
                err.config.headers.authorization = `Bearer ${getJWTToken()}`;
                return axios(err.config);
              }
              throw err;
            });
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          errors,
          setFieldValue,
          touched,
        }) => (
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <label htmlFor={"sweepSourceAccountId"}>
                Sweep Source Account Id
                {errors.sweepSourceAccountId &&
                  touched.sweepSourceAccountId && (
                    <span>{errors.sweepSourceAccountId}</span>
                  )}
              </label>
              <Select
                style={{ width: "100%", padding: "10px " }}
                name="sweepSourceAccountId"
                onChange={handleChange}
                value={values.sweepSourceAccountId}
              >
                <option value={""} disabled>
                  Select an account
                </option>

                {accounts &&
                  accounts.map((account, idx) => (
                    <option value={account.id} key={idx}>
                      {account.friendlyName}
                    </option>
                  ))}
              </Select>
            </InputWrapper>

            <InputWrapper>
              <FriendlySelect
                onChange={(v) => {
                  setFieldValue("linkedAccountHolderId", v.accountHolderId);
                  setFieldValue("accountId", v.id);
                }}
              />
            </InputWrapper>

            <InputToJsx
              name="beneficiary.bankAccountCountry"
              label="Bank Account Country"
              onChange={handleChange}
              value={values.beneficiary?.bankAccountCountry}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.bankName"
              label="Bank Name"
              onChange={handleChange}
              value={values.beneficiary?.bankName}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.firstName"
              label="First Name"
              onChange={handleChange}
              value={values.beneficiary?.firstName}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.lastName"
              label="Last Name"
              onChange={handleChange}
              value={values.beneficiary?.lastName}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.beneficiaryAddressLine"
              label="Beneficiary Address Line"
              onChange={handleChange}
              value={values.beneficiary?.beneficiaryAddressLine}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.beneficiaryCity"
              label="Beneficiary City"
              onChange={handleChange}
              value={values.beneficiary?.beneficiaryCity}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.beneficiaryCountry"
              label="Beneficiary Country"
              onChange={handleChange}
              value={values.beneficiary?.beneficiaryCountry}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.beneficiaryPostalCode"
              label="Beneficiary Postal Code"
              onChange={handleChange}
              value={values.beneficiary?.beneficiaryPostalCode}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.iban"
              label="IBAN"
              onChange={handleChange}
              value={values.beneficiary?.iban}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.bic"
              label="BIC"
              onChange={handleChange}
              value={values.beneficiary?.bic}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.accountNumber"
              label="Account Number"
              onChange={handleChange}
              value={values.beneficiary?.accountNumber}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="beneficiary.routingCodes.SORT_CODE"
              label="Sort Code"
              onChange={handleChange}
              value={values.beneficiary?.routingCodes?.SORT_CODE}
              errors={errors}
              touched={touched}
            />

            <InputToJsx
              name="amount.currency"
              label="Currency"
              onChange={handleChange}
              value={values.amount.currency}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="amount.value"
              label="Amount"
              onChange={handleChange}
              value={values.amount.value}
              errors={errors}
              touched={touched}
              type="number"
            />
            <InputToJsx
              name="paymentType"
              label="Payment Type"
              onChange={handleChange}
              value={values.paymentType}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="reference"
              label="Reference"
              onChange={handleChange}
              value={values.reference}
              errors={errors}
              touched={touched}
            />
            <InputToJsx
              name="reasonCode"
              label="Reason Code"
              onChange={handleChange}
              value={values.reasonCode}
              errors={errors}
              touched={touched}
            />
            <BtnWrap>
              <ActionButton type="submit" invert>
                Submit
              </ActionButton>
            </BtnWrap>
          </Form>
        )}
      </Formik>
    </Outer>
  );
};

export default SweepFrom;
