import React, { useEffect, useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import {
  FormTitle,
  Label,
  ErrorMessage,
  ButtonContainer,
  InputField,
  SumbitButton,
} from "../formComponents/FormGeneric";
import { Loader, ActionButton } from "../generic";
import axios from "axios";
import { useNotification } from "../actionNotification/NotificationProvider";
import ModalHook from "../ModalHook";
import useTheme from "../../utils/hooks/useTheme";
import { Checkbox, DatePicker } from "../formComponents/FormGeneric";
import { Select } from "../formComponents/FormGeneric";
import agent from "../../utils/agent";

const Outer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  padding: 40px 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  & form {
    max-width: 800px;
    width: 100%;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    gap: 15px;
  }
`;

const CusLabel = styled.label`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 700;
  cursor: pointer;
  padding: 3px;
`;

const Content = styled.div`
  width: 50%;
  margin: 10px;
`;

const TopRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HalfSide = styled.div`
  max-width: calc(50% - (15px / 2));
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FullSide = styled.div`
  max-width: 100%;
  width: 100%;
`;

const ModalBody = styled.div`
  color: #000;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background-color: ${({ theme }) => theme.semi};
  border-radius: 5px;
  padding: 10px;
`;

const ModalRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 5px;
`;

const BreakLine = styled.div`
  height: 5px;
  width: 100%;
  color: white;
  background-color: ${({ theme }) => theme.primary};
  margin-bottom: 10px;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 150px;
  background-color: ${({ theme }) => theme.semi};
  color: palegoldenrod;
  font-size: 16px;
  overflow: hidden;
  outline: none;
  border: none;
  margin: 10px;
`;

const SelectOuter = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 5px;
  border: 1px solid
    ${({ theme, invert }) => (invert ? theme.primary : theme.secondary)};
  background-color: ${({ theme, invert }) =>
    invert ? theme.secondary : theme.primary};
  border-radius: 5px;
  padding: 5px;
`;

function Modal({ closeModal, theme, checkBoxes, setCheckBoxes, setFilters }) {
  useEffect(() => {
    let result = Object.keys(checkBoxes).filter(
      (key) => checkBoxes[key].isCheck
    );

    setFilters(result.length > 0 ? true : false);
  }, [checkBoxes]);

  return (
    <div>
      <ModalBody>
        <ModalRow>
          <div>
            <Checkbox
              checked={checkBoxes.personal_details.isCheck}
              invert
              id="personal_details"
              onChange={() => {
                setCheckBoxes(
                  "personal_details.isCheck",
                  !checkBoxes.personal_details.isCheck
                );
              }}
            />
            <CusLabel htmlFor="personal_details">
              Personal Details (state, city, post code, address, country, etc.)
            </CusLabel>
          </div>
        </ModalRow>
        <ModalRow>
          <div>
            <Checkbox
              checked={checkBoxes.first_name.isCheck}
              invert
              id="first_name"
              onChange={() =>
                setCheckBoxes(
                  "first_name.isCheck",
                  !checkBoxes.first_name.isCheck
                )
              }
            />
            <CusLabel htmlFor="first_name">First Name</CusLabel>
          </div>
          <div>
            <Checkbox
              checked={checkBoxes.last_name.isCheck}
              invert
              id="last_name"
              onChange={() =>
                setCheckBoxes(
                  "last_name.isCheck",
                  !checkBoxes.last_name.isCheck
                )
              }
            />
            <CusLabel htmlFor="last_name">Last Name</CusLabel>
          </div>
          <div>
            <Checkbox
              checked={checkBoxes.friendly_name.isCheck}
              invert
              id="friendly_name"
              onChange={() =>
                setCheckBoxes(
                  "friendly_name.isCheck",
                  !checkBoxes.friendly_name.isCheck
                )
              }
            />
            <CusLabel htmlFor="friendly_name">Friendly Name</CusLabel>
          </div>
        </ModalRow>
        <ModalRow>
          <div>
            <Checkbox
              checked={checkBoxes.metaData.isCheck}
              invert
              id="metaData"
              onChange={() =>
                setCheckBoxes("metaData.isCheck", !checkBoxes.metaData.isCheck)
              }
            />
            <CusLabel htmlFor="metaData">MetaData</CusLabel>
          </div>
          <div>
            <Checkbox
              checked={checkBoxes.dob.isCheck}
              invert
              id="dob"
              onChange={() =>
                setCheckBoxes("dob.isCheck", !checkBoxes.dob.isCheck)
              }
            />
            <CusLabel htmlFor="dob">Date of Birth</CusLabel>
          </div>
          <div>
            <Checkbox
              checked={checkBoxes.email.isCheck}
              invert
              id="email"
              onChange={() =>
                setCheckBoxes("email.isCheck", !checkBoxes.email.isCheck)
              }
            />
            <CusLabel htmlFor="email">Email</CusLabel>
          </div>
        </ModalRow>
        <ModalRow>
          <div>
            <Checkbox
              checked={checkBoxes.phone.isCheck}
              invert
              id="phone"
              onChange={() =>
                setCheckBoxes("phone.isCheck", !checkBoxes.phone.isCheck)
              }
            />
            <CusLabel htmlFor="phone">Phone</CusLabel>
          </div>
          <div>
            <Checkbox
              checked={checkBoxes.company_name.isCheck}
              invert
              id="company_name"
              onChange={() =>
                setCheckBoxes(
                  "company_name.isCheck",
                  !checkBoxes.company_name.isCheck
                )
              }
            />
            <CusLabel htmlFor="company_name">Company Name</CusLabel>
          </div>
          <div>
            <Checkbox
              checked={checkBoxes.contact_name.isCheck}
              invert
              id="contact_name"
              onChange={() =>
                setCheckBoxes(
                  "contact_name.isCheck",
                  !checkBoxes.contact_name.isCheck
                )
              }
            />
            <CusLabel htmlFor="contact_name">Contact Name</CusLabel>
          </div>
        </ModalRow>
        <ModalRow>
          <div>
            <Checkbox
              checked={checkBoxes.identification.isCheck}
              invert
              id="identification"
              onChange={() =>
                setCheckBoxes(
                  "identification.isCheck",
                  !checkBoxes.identification.isCheck
                )
              }
            />
            <CusLabel htmlFor="identification">Identification</CusLabel>
          </div>
          <div>
            <Checkbox
              checked={checkBoxes.company_type.isCheck}
              invert
              id="company_type"
              onChange={() =>
                setCheckBoxes(
                  "company_type.isCheck",
                  !checkBoxes.company_type.isCheck
                )
              }
            />
            <CusLabel htmlFor="company_type">Company Type</CusLabel>
          </div>
          <div>
            <Checkbox
              checked={checkBoxes.registration_number.isCheck}
              invert
              id="registration_number"
              onChange={() =>
                setCheckBoxes(
                  "registration_number.isCheck",
                  !checkBoxes.registration_number.isCheck
                )
              }
            />
            <CusLabel htmlFor="registration_number">
              Registrtion Number
            </CusLabel>
          </div>
        </ModalRow>
      </ModalBody>
      <ActionButton
        style={{ backgroundColor: theme.textSecondary }}
        onClick={() => closeModal()}
      >
        Close
      </ActionButton>
    </div>
  );
}

const convertValuesToObject = (values) => {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      acc[key] = value;
    } else if (value.isCheck) {
      if (key === "identification") {
        acc["identificationType"] = value.identification.type;
        acc["identificationValue"] = value.identification.value;
      } else if (key === "metaData") {
        acc["metaData"] = JSON.parse(value.value);
      } else if (key === "personal_details") {
        acc["state"] = value.state;
        acc["country"] = value.country;
        acc["city"] = value.city;
        acc["address_line_1"] = value.address_line_1;
        acc["address_line_2"] = value.address_line_2;
        acc["postal_code"] = value.postal_code;
      } else {
        acc[key] = value.value;
      }
    }
    return acc;
  }, {});
};

const editUserSchema = Yup.object().shape({
  first_name: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("First Name").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  last_name: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("First Name").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  friendly_name: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("Friendly Name").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  dob: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.date().label("Date of birth").when("isCheck", {
      is: true,
      then: Yup.date().required(),
    }),
  }),
  email: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("Email").when("isCheck", {
      is: true,
      then: Yup.string().required().email(),
    }),
  }),
  phone: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("Phone").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  contact_name: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("Contact Name").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  company_name: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("Company Name").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  identification: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("Identification Value").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
    type: Yup.string().label("Identification Type").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  company_type: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("Company Type").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  registration_number: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string().label("Registration Number").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  personal_details: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    state: Yup.string().label("State").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
    city: Yup.string().label("City").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
    post_code: Yup.string().label("Post Code").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
    country: Yup.string().label("Country").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
    address_line_1: Yup.string().label("Address Line 1").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
    address_line_2: Yup.string().label("Address Line 2").when("isCheck", {
      is: true,
      then: Yup.string().required(),
    }),
  }),
  metaData: Yup.object().shape({
    isCheck: Yup.boolean().required(),
    value: Yup.string()
      .label("MetaData")
      .when("isCheck", {
        is: true,
        then: Yup.string()
          .test("is-json", "MetaData must be a valid JSON", (value) => {
            try {
              JSON.parse(value);
              return true;
            } catch (err) {
              return false;
            }
          })
          .required(),
      }),
  }),
  account_holder_id: Yup.string().required().label("Account Holder Id"),
});

function UpdateClientInfo() {
  const { theme } = useTheme();

  const [errorState, setErrorState] = useState(false);
  const sendNotif = useNotification();
  const [errorMsg, setErrorMsg] = useState("");
  const [hasFilters, setHasFilters] = useState(false);

  return (
    <Outer>
      <FormTitle style={{ width: "100%" }}>
        Update OpenPayd Account Details
      </FormTitle>
      <Formik
        initialValues={{
          account_holder_id: "",
          first_name: {
            value: "",
            isCheck: false,
          },
          last_name: {
            value: "",
            isCheck: false,
          },
          friendly_name: {
            value: "",
            isCheck: false,
          },
          metaData: {
            value: "",
            isCheck: false,
          },
          dob: {
            value: "",
            isCheck: false,
          },
          email: {
            value: "",
            isCheck: false,
          },
          phone: {
            value: "",
            isCheck: false,
          },
          contact_name: {
            value: "",
            isCheck: false,
          },
          company_name: {
            value: "",
            isCheck: false,
          },
          identification: {
            value: "",
            type: "NATIONAL_ID",
            isCheck: false,
          },
          company_type: {
            value: "LIMITED_LIABILITY",
            isCheck: false,
          },
          registration_number: {
            value: "",
            isCheck: false,
          },
          personal_details: {
            isCheck: false,
            state: "",
            city: "",
            post_code: "",
            address_line_1: "",
            address_line_2: "",
            country: "",
          },
        }}
        validationSchema={editUserSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setErrorState(false);
          try {
            await axios
              .post(
                "/api/openPayd/updateClientPersonalDetails",
                convertValuesToObject(values),
                {
                  headers: {
                    authorization: `Bearer ${getJWTToken()}`,
                  },
                }
              )
              .catch(async (err) => {
                if (err?.response?.status === 401) {
                  await agent().refreshAccessToken();
                  err.config.headers.authorization = `Bearer ${getJWTToken()}`;
                  return axios(err.config);
                }
                throw err;
              });
            sendNotif.SUCCESS("Successfully updated client details");
          } catch (err) {
            sendNotif.ERROR("Something went wrong");
            console.error(err);
            setErrorState(true);
            if (err?.response?.status === 400) {
              setErrorMsg("Invalid data");
            } else {
              setErrorMsg(err?.response?.data?.message || "Something is wrong");
            }
          }
          setSubmitting(false);
        }}
      >
        {({
          handleSubmit,
          isSubmitting,
          errors,
          setFieldValue,
          getFieldProps,
          handleChange,
          values,
          resetForm,
        }) => (
          <>
            {isSubmitting && <Loader />}
            <Content>
              <TopRow>
                <ModalHook
                  componentToShow={
                    <Modal
                      theme={theme}
                      checkBoxes={values}
                      setCheckBoxes={setFieldValue}
                      setFilters={setHasFilters}
                    />
                  }
                >
                  {({ openModal }) => (
                    <ActionButton
                      style={{ backgroundColor: theme.blue }}
                      onClick={() => openModal()}
                    >
                      Filters
                    </ActionButton>
                  )}
                </ModalHook>
                <ActionButton
                  onClick={() => {
                    resetForm();
                    setHasFilters(false);
                  }}
                >
                  Reset Form
                </ActionButton>
              </TopRow>

              <Form>
                <HalfSide>
                  <Label>Account holder ID:</Label>
                  <InputField
                    smallStyles
                    type="text"
                    name="account_holder_id"
                    value={values.account_holder_id}
                    onChange={handleChange}
                  />
                  <ErrorMessage>{errors.account_holder_id}</ErrorMessage>
                  {values.personal_details.isCheck && (
                    <>
                      <Label>Address Line 1:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="personal_details.address_line_1"
                        value={values.personal_details.address_line_1}
                        onChange={handleChange}
                      />
                      <ErrorMessage>
                        {errors.personal_details?.address_line_1}
                      </ErrorMessage>
                    </>
                  )}
                  {values.personal_details.isCheck && (
                    <>
                      <Label>Address Line 2:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="personal_details.address_line_2"
                        value={values.personal_details.address_line_2}
                        onChange={handleChange}
                      />
                      <ErrorMessage>
                        {errors.personal_details?.address_line_2}
                      </ErrorMessage>
                    </>
                  )}
                  {values.personal_details.isCheck && (
                    <>
                      <Label>City:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="personal_details.city"
                        value={values.personal_details.city}
                        onChange={handleChange}
                      />
                      <ErrorMessage>
                        {errors.personal_details?.city}
                      </ErrorMessage>
                    </>
                  )}
                  {values.last_name.isCheck && (
                    <>
                      <Label>Last Name:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="last_name.value"
                        value={values.last_name.value}
                        onChange={handleChange}
                      />
                      <ErrorMessage> {errors.last_name?.value}</ErrorMessage>
                    </>
                  )}
                  {values.dob.isCheck && (
                    <>
                      <Label>Date of Birth:</Label>
                      <DatePicker
                        name="dob.value"
                        value={values.dob.value}
                        onChange={handleChange}
                      ></DatePicker>
                      <ErrorMessage>{errors.dob?.value}</ErrorMessage>
                    </>
                  )}
                  {values.phone.isCheck && (
                    <>
                      <Label>Phone:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="phone.value"
                        value={values.phone.value}
                        onChange={handleChange}
                      ></InputField>
                      <ErrorMessage>{errors.phone?.value}</ErrorMessage>
                    </>
                  )}
                  {values.identification.isCheck && (
                    <>
                      <Label>Identification Value:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="identification.value"
                        value={values.identification.value}
                        onChange={handleChange}
                      ></InputField>
                      <ErrorMessage>
                        {errors.identification?.value}
                      </ErrorMessage>
                      <SelectOuter>
                        <Label>Identification Type:</Label>
                        <Select
                          name="identification.type"
                          onChange={handleChange}
                        >
                          <option value="NATIONAL_ID">NATIONAL_ID</option>
                          <option value="OTHER">OTHER</option>
                          <option value="PASSPORT">PASSPORT</option>
                          <option value="DRIVERS_LICENSE">
                            DRIVERS_LICENSE
                          </option>
                        </Select>
                      </SelectOuter>
                    </>
                  )}
                  {values.registration_number.isCheck && (
                    <>
                      <Label>Registration Number:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="registration_number.value"
                        value={values.registration_number.value}
                        onChange={handleChange}
                      ></InputField>
                      <ErrorMessage>
                        {errors.registration_number?.value}
                      </ErrorMessage>
                    </>
                  )}
                </HalfSide>
                <HalfSide>
                  {values.personal_details.isCheck && (
                    <>
                      <Label>State:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="personal_details.state"
                        value={values.personal_details.state}
                        onChange={handleChange}
                      />
                      <ErrorMessage>
                        {" "}
                        {errors.personal_details?.state}
                      </ErrorMessage>
                    </>
                  )}
                  {values.personal_details.isCheck && (
                    <>
                      <Label>Post Code:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="personal_details.post_code"
                        value={values.personal_details.post_code}
                        onChange={handleChange}
                      />
                      <ErrorMessage>
                        {errors.personal_details?.post_code}
                      </ErrorMessage>
                    </>
                  )}
                  {values.personal_details.isCheck && (
                    <>
                      <Label>Country:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="personal_details.country"
                        value={values.personal_details.country}
                        onChange={handleChange}
                      />
                      <ErrorMessage>
                        {errors.personal_details?.country}
                      </ErrorMessage>
                    </>
                  )}
                  {values.first_name.isCheck && (
                    <>
                      <Label>First Name:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="first_name.value"
                        value={values.first_name.value}
                        onChange={handleChange}
                      />
                      <ErrorMessage> {errors.first_name?.value}</ErrorMessage>
                    </>
                  )}
                  {values.friendly_name.isCheck && (
                    <>
                      <Label>Friendly Name:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="friendly_name.value"
                        value={values.friendly_name.value}
                        onChange={handleChange}
                      />
                      <ErrorMessage>{errors.friendly_name?.value}</ErrorMessage>
                    </>
                  )}
                  {values.email.isCheck && (
                    <>
                      <Label>Email:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="email.value"
                        value={values.email.value}
                        onChange={handleChange}
                      />
                      <ErrorMessage>{errors.email?.value}</ErrorMessage>
                    </>
                  )}
                  {values.company_name.isCheck && (
                    <>
                      <Label>Company Name:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="company_name.value"
                        value={values.company_name.value}
                        onChange={handleChange}
                      />
                      <ErrorMessage>{errors.company_name?.value}</ErrorMessage>
                    </>
                  )}
                  {values.contact_name.isCheck && (
                    <>
                      <Label>Contact Name:</Label>
                      <InputField
                        smallStyles
                        type="text"
                        name="contact_name.value"
                        value={values.contact_name.value}
                        onChange={handleChange}
                      />
                      <ErrorMessage>{errors.contact_name?.value}</ErrorMessage>
                    </>
                  )}
                  {values.company_type.isCheck && (
                    <>
                      <SelectOuter>
                        <Label>Company Type:</Label>
                        <Select name="company.type" onChange={handleChange}>
                          <option value="LIMITED_LIABILITY">
                            LIMITED_LIABILITY
                          </option>
                          <option value="SOLE_TRADER">SOLE_TRADER</option>
                          <option value="PARTNERSHIP">PARTNERSHIP</option>
                          <option value="PUBLIC_LIMITED_COMPANY">
                            PUBLIC_LIMITED_COMPANY
                          </option>
                          <option value="JOINT_STOCK_COMPANY">
                            JOINT_STOCK_COMPANY
                          </option>
                          <option value="CHARITY">CHARITY</option>
                        </Select>
                      </SelectOuter>
                    </>
                  )}
                </HalfSide>
                <FullSide>
                  <BreakLine />
                  {values.metaData.isCheck && (
                    <>
                      <Label>MetaData: </Label>
                      <StyledTextarea
                        type="text"
                        name="metaData.value"
                        value={values.metaData.value}
                        onChange={handleChange}
                      />
                    </>
                  )}
                  <ErrorMessage>{errors.metaData?.value}</ErrorMessage>
                  {hasFilters > 0 && (
                    <ButtonContainer>
                      <SumbitButton type="submit" disabled={isSubmitting}>
                        Update
                      </SumbitButton>
                    </ButtonContainer>
                  )}

                  {errorState && (
                    <ErrorMessage
                      style={{
                        textAlign: "center",
                        width: "100%",
                        fontSize: 16,
                      }}
                    >
                      {errorMsg}
                    </ErrorMessage>
                  )}
                </FullSide>
              </Form>
            </Content>
          </>
        )}
      </Formik>
    </Outer>
  );
}

export default UpdateClientInfo;
