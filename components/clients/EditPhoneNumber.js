import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { Formik } from "formik";
import "yup-phone";
import {
  FormTitle,
  Label,
  ErrorMessage,
  ButtonContainer,
  InputField,
  SumbitButton,
  Select,
} from "../formComponents/FormGeneric";
import { colors } from "../../config/colors";
import { Loader } from "../generic";
import agent from "../../utils/agent";
import { availableLanguagesObj } from "../../config/languages";
import { useNotification } from "../actionNotification/NotificationProvider";
import { countryDataCodes } from "../../config/countries";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Outer = styled.div`
  max-width: 700px;
  max-height: calc(100vh - 70px);
  overflow: auto;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  padding: 40px 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  & form {
    max-width: calc(100% - 80px);
    width: 100%;
    margin: auto;
    display: flex;
    /* flex-direction: column; */
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 5px;
  }

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

const HorContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const FullContainer = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function EditPhoneNumber({ client, closeModal }) {
  const [errorState, setErrorState] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [dial, setDial] = useState(null);

  const editPhoneSchema = Yup.object().shape({
    phone: Yup.string()
      .required()
      .test("phone", "Phone number is not valid", (value) => {
        const phone = `+${dial} ${value}`;
        return Yup.string().phone().isValidSync(phone);
      }),
  });

  const queryClient = useQueryClient();
  const actionNotification = useNotification();
  const [selectedBrand] = useSelectedBrand();

  const editPhoneNumber = useMutation(
    (updatedPhone) => agent().editPhone(client._id, updatedPhone),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries([selectedBrand, "client", client._id])
          .then(() => closeModal());
        actionNotification.SUCCESS("Client updated successfully");
      },
      mutationKey: ["editPhoneNumber"],
    }
  );

  const languages = Object.values(availableLanguagesObj);

  return (
    <Outer>
      <Formik
        initialValues={{
          phone: client.phone || "",
        }}
        validationSchema={editPhoneSchema}
        onSubmit={(values, { setSubmitting }) => {
          editPhoneNumber.mutate(
            { phone: `+${dial}${values.phone}` },
            {
              onError: (err) => {
                setErrorState(true);
                setSubmitting(false);
                setErrorMsg(err.response.data.message);
              },
            }
          );
        }}
      >
        {({
          handleSubmit,
          isSubmitting,
          errors,
          setFieldValue,
          getFieldProps,
        }) => (
          <>
            {isSubmitting && <Loader />}
            <form>
              <BtnContainer>
                <FormTitle>Edit Phone Number</FormTitle>
              </BtnContainer>

              <HorContainer>
                <FullContainer>
                  <Label>Dial Code:</Label>
                  <Select
                    style={{ height: "40px", width: "290px" }}
                    defaultValue={
                      countryDataCodes.find((el) => el.dialCode === dial)
                        ?.dialCode || ""
                    }
                    onChange={(e) => {
                      setDial(e.target.value);
                    }}
                  >
                    <option value={""} disabled>
                      Please Select
                    </option>
                    {countryDataCodes.map((el, idx) => (
                      <option key={idx} value={el.dialCode}>
                        {`${el.name} (+${el.dialCode})`}
                      </option>
                    ))}
                  </Select>
                </FullContainer>

                <FullContainer>
                  <Label>Phone Number:</Label>
                  <InputField
                    style={{ width: "290px" }}
                    type="text"
                    name="phone"
                    value={getFieldProps("phone").value}
                    onFocus={(e) => {
                      e.target.value = "";
                    }}
                    onChange={(e) => {
                      setFieldValue("phone", e.target.value);
                      setErrorState(false);
                    }}
                  />
                  <ErrorMessage>{errors.phone}</ErrorMessage>
                </FullContainer>
              </HorContainer>

              <BtnContainer>
                <ButtonContainer>
                  <SumbitButton onClick={handleSubmit} disabled={isSubmitting}>
                    Save
                  </SumbitButton>
                </ButtonContainer>
              </BtnContainer>

              {errorState && (
                <ErrorMessage style={{ alignSelf: "center" }}>
                  {errorMsg}
                </ErrorMessage>
              )}
            </form>
          </>
        )}
      </Formik>
    </Outer>
  );
}
