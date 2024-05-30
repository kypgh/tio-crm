import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form } from "formik";
import { useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { DateTime } from "luxon";
import { countryDataCodes } from "../../config/countries";
import { LANGUAGES } from "../../config/languages";
import agent from "../../utils/agent";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { useNotification } from "../actionNotification/NotificationProvider";
import {
  ButtonContainer,
  DatePicker,
  ErrorMessage,
  FormTitle,
  InputField,
  Label,
  Select,
  SumbitButton,
} from "../formComponents/FormGeneric";
import {
  ActionButton,
  BtnGeneric,
  ButtonBlue,
  Loader,
  Switch,
} from "../generic";

import {
  parseJoiErrorsFromBackend,
  pruneNullOrUndefinedFields,
} from "../../utils/functions";

const FormSC = styled(Form)`
  position: relative;
  max-height: calc(100vh - 70px);
  overflow: auto;
  width: 100%;
  max-width: 1200px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 40px 10px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.primary};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand};
    border-radius: 50px;
  }
`;

const TwoColumnContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  & > div {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: ${({ theme }) => theme.secondary};
  padding: 20px;
  border-radius: 8px;
  flex-grow: 1;
`;

const GroupTitle = styled.h4`
  color: ${({ theme }) => theme.textPrimary};
  margin-left: 8px;
`;

const FullContainer = styled.div`
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const HorContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  justify-content: center;
  align-items: center;
`;

const formatDate = (date) => {
  if (!date) return date;
  return DateTime.fromISO(date).toFormat("yyyy-MM-dd");
};

const editClientSchema = Yup.object().shape({
  first_name: Yup.string().required().label("First Name"),
  last_name: Yup.string().required().label("Last Name"),
  country: Yup.string().required().label("Country"),
  address: Yup.string().label("Address"),
  city: Yup.string().label("City"),
  language: Yup.string().label("Language"),
  deviceType: Yup.string().label("Device"),
  nationality: Yup.string().label("Nationality"),
  gender: Yup.string().label("Gender"),
  houseNumber: Yup.string().label("House Number"),
  identificationNumber: Yup.string().label("ID Number"),
  dob: Yup.string().label("Date of Birth"),
  postcode: Yup.string().label("Post code"),
  title: Yup.string().label("Title"),
  unitNumber: Yup.string().label("Unit Number"),
  shariaEnabled: Yup.boolean().label("Sharia Enabled"),
  secondaryEmail: Yup.string().email().label("Secondary Email"),
});
export default function EditClientInfo({ client, closeModal }) {
  const [errorState, setErrorState] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);

  const queryClient = useQueryClient();
  const actionNotification = useNotification();
  const [selectedBrand] = useSelectedBrand();

  const editClientDetails = useMutation(
    (updatedUser) => agent().editClient(client._id, updatedUser),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries([selectedBrand, "client", client._id])
          .then(() => closeModal());
        actionNotification.SUCCESS("Client updated successfully");
      },
      mutationKey: ["editClientDetails"],
    }
  );

  console.log(client.secondaryEmail);

  return (
    <Formik
      initialValues={{
        first_name: client.first_name,
        last_name: client.last_name,
        // email: client.email ,
        country: client.country,
        address: client.address,
        nationality: client.nationality,
        gender: client.gender,
        identificationNumber: client.identificationNumber,
        dob: formatDate(client.dob),
        houseNumber: client.houseNumber,
        unitNumber: client.unitNumber,
        postcode: client.postcode,
        title: client.title,
        city: client.city || client.metadata.city,
        language: client.language || client.metadata.language,
        deviceType: client.deviceType || client.metadata.deviceType || "win",
        shariaEnabled: client.flags.shariaEnabled || false,
        secondaryEmail: client.secondaryEmail,
      }}
      enableReinitialize
      validationSchema={editClientSchema}
      onSubmit={(values, { setSubmitting }) => {
        editClientDetails.mutate(pruneNullOrUndefinedFields(values), {
          onError: (err) => {
            setErrorState(true);
            setSubmitting(false);
            setErrorMsg(parseJoiErrorsFromBackend(err.response.data));
          },
        });
      }}
    >
      {({ handleSubmit, isSubmitting, errors, setFieldValue, values }) => (
        <FormSC>
          {isSubmitting && <Loader />}
          <FullContainer>
            <FormTitle>Edit Client Info</FormTitle>
          </FullContainer>
          <TwoColumnContainer>
            <div>
              <GroupTitle>Personal Details</GroupTitle>
              <FieldGroup>
                <HorContainer>
                  <FullContainer>
                    <Label>First Name:</Label>
                    <InputField
                      type="text"
                      name="first_name"
                      value={values.first_name}
                      onChange={(e) => {
                        setFieldValue("first_name", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.first_name}</ErrorMessage>
                  </FullContainer>
                  <FullContainer>
                    <Label>Last Name:</Label>
                    <InputField
                      type="text"
                      name="last_name"
                      value={values.last_name}
                      onChange={(e) => {
                        setFieldValue("last_name", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.last_name}</ErrorMessage>
                  </FullContainer>
                </HorContainer>
                <HorContainer>
                  <FullContainer>
                    <Label>Title:</Label>
                    <InputField
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={(e) => {
                        setFieldValue("title", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.title}</ErrorMessage>
                  </FullContainer>
                  <FullContainer>
                    <Label>Gender:</Label>
                    <InputField
                      type="text"
                      name="gender"
                      value={values.gender}
                      onChange={(e) => {
                        setFieldValue("gender", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.gender}</ErrorMessage>
                  </FullContainer>
                </HorContainer>
                <HorContainer>
                  <FullContainer>
                    <Label>Date of Birth:</Label>
                    <DatePicker
                      name="dob"
                      value={values.dob}
                      style={{ padding: "10px" }}
                      onChange={(e) => {
                        setFieldValue("dob", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.dob}</ErrorMessage>
                  </FullContainer>
                  <FullContainer>
                    <Label>ID Number:</Label>
                    <InputField
                      type="text"
                      name="identificationNumber"
                      value={values.identificationNumber}
                      onChange={(e) => {
                        setFieldValue("identificationNumber", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.identificationNumber}</ErrorMessage>
                  </FullContainer>
                </HorContainer>

                <HorContainer>
                  <FullContainer>
                    <Label>Nationality:</Label>
                    <Select
                      style={{ width: "100%", height: "41px" }}
                      defaultValue={
                        countryDataCodes
                          .find(
                            (el) =>
                              el.iso2.toLowerCase() ===
                              values.nationality?.toLowerCase()
                          )
                          ?.iso2.toUpperCase() || ""
                      }
                      onChange={(e) =>
                        setFieldValue("nationality", e.target.value)
                      }
                    >
                      <option value={""} disabled>
                        Please Select
                      </option>
                      {countryDataCodes.map((el, idx) => (
                        <option key={idx} value={el.iso2.toUpperCase()}>
                          {el.nationality}
                        </option>
                      ))}
                    </Select>
                    <ErrorMessage>{errors.nationality}</ErrorMessage>
                  </FullContainer>
                  <FullContainer>
                    <Label>Country:</Label>
                    <Select
                      style={{ width: "100%", height: "41px" }}
                      defaultValue={
                        countryDataCodes
                          .find(
                            (el) =>
                              el.iso2.toLowerCase() ===
                              values.country?.toLowerCase()
                          )
                          .iso2.toUpperCase() || ""
                      }
                      onChange={(e) => setFieldValue("country", e.target.value)}
                    >
                      {countryDataCodes.map((el, idx) => (
                        <option key={idx} value={el.iso2.toUpperCase()}>
                          {el.name}
                        </option>
                      ))}
                    </Select>
                    <ErrorMessage>{errors.country}</ErrorMessage>
                  </FullContainer>
                </HorContainer>
                <HorContainer>
                  <FullContainer>
                    <Label>Secondary Email:</Label>
                    <InputField
                      type="text"
                      name="secondaryEmail"
                      value={values.secondaryEmail}
                      onChange={(e) => {
                        setFieldValue("secondaryEmail", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.secondaryEmail}</ErrorMessage>
                  </FullContainer>
                </HorContainer>
              </FieldGroup>
            </div>
            <div>
              <GroupTitle>Address and Extra Details</GroupTitle>
              <FieldGroup>
                <HorContainer>
                  <FullContainer>
                    <Label>City:</Label>
                    <InputField
                      type="text"
                      name="city"
                      value={values.city}
                      onChange={(e) => {
                        setFieldValue("city", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.city}</ErrorMessage>
                  </FullContainer>
                  <FullContainer>
                    <Label>Address:</Label>
                    <InputField
                      type="text"
                      name="address"
                      value={values.address}
                      onChange={(e) => {
                        setFieldValue("address", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.address}</ErrorMessage>
                  </FullContainer>
                </HorContainer>
                <HorContainer>
                  <FullContainer>
                    <Label>House Number:</Label>
                    <InputField
                      type="text"
                      name="houseNumber"
                      value={values.houseNumber}
                      onChange={(e) => {
                        setFieldValue("houseNumber", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.houseNumber}</ErrorMessage>
                  </FullContainer>
                  <FullContainer>
                    <Label>Unit Number:</Label>
                    <InputField
                      type="text"
                      name="unitNumber"
                      value={values.unitNumber}
                      onChange={(e) => {
                        setFieldValue("unitNumber", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.unitNumber}</ErrorMessage>
                  </FullContainer>
                  <FullContainer>
                    <Label>Post code:</Label>
                    <InputField
                      type="text"
                      name="postcode"
                      value={values.postcode}
                      onChange={(e) => {
                        setFieldValue("postcode", e.target.value);
                        setErrorState(false);
                      }}
                    />
                    <ErrorMessage>{errors.postcode}</ErrorMessage>
                  </FullContainer>
                </HorContainer>
                <HorContainer>
                  <FullContainer>
                    <Label>Language:</Label>
                    <Select
                      style={{ width: "100%", height: "41px" }}
                      defaultValue={values.language.toLowerCase()}
                      onChange={(e) =>
                        setFieldValue("language", e.target.value)
                      }
                    >
                      {/* <option
                    value=""
                    disabled
                    style={{ textTransform: "capitalize" }}
                    >
                    Select
                  </option> */}
                      {LANGUAGES.map((el, idx) => (
                        <option key={idx} value={el.code}>
                          {`${el.name} (${el.code})`}
                        </option>
                      ))}
                    </Select>
                    <ErrorMessage>{errors.language}</ErrorMessage>
                  </FullContainer>
                  <FullContainer>
                    <Label>Device:</Label>
                    <Select
                      style={{ width: "100%", height: "41px" }}
                      defaultValue={values.deviceType}
                      onChange={(e) =>
                        setFieldValue("deviceType", e.target.value)
                      }
                    >
                      <option
                        value=""
                        disabled
                        style={{ textTransform: "capitalize" }}
                      >
                        Select
                      </option>
                      <option value="iOS">iOS</option>
                      <option value="android">Android</option>
                      <option value="win">Windows</option>
                    </Select>
                    <ErrorMessage>{errors.deviceType}</ErrorMessage>
                  </FullContainer>
                </HorContainer>

                <HorContainer>
                  <FullContainer
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    <Label>Sharia Enabled</Label>
                    <Switch
                      checked={values.shariaEnabled}
                      onChange={(e) =>
                        setFieldValue("shariaEnabled", e.target.checked)
                      }
                    />

                    <ErrorMessage>{errors.shariaEnabled}</ErrorMessage>
                  </FullContainer>
                </HorContainer>
              </FieldGroup>
            </div>
          </TwoColumnContainer>

          <HorContainer style={{ marginTop: "20px" }}>
            <ActionButton
              onClick={() => closeModal()}
              type="button"
              style={{ padding: "10px 20px", fontSize: "medium" }}
            >
              Cancel
            </ActionButton>
            <ButtonContainer>
              <ButtonBlue
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ padding: "10px 20px" }}
              >
                Save
              </ButtonBlue>
            </ButtonContainer>
          </HorContainer>
          {errorState && (
            <ErrorMessage style={{ alignSelf: "center" }}>
              {errorMsg?.map((el, idx) => (
                <div key={idx}>{el?.message}</div>
              ))}
            </ErrorMessage>
          )}
        </FormSC>
      )}
    </Formik>
  );
}
