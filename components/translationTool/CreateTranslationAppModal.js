import React from "react";
import styled from "styled-components";
import { ActionButton, Loader } from "../generic";
import { FaTimes } from "react-icons/fa";
import { FormTitle, InputField, Label } from "../formComponents/FormGeneric";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import translationToolAgent from "../../utils/translationToolAgent";
import { useNotification } from "../actionNotification/NotificationProvider";
import ManageLang from "./ManageLang";
import _ from "lodash";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 700px;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  position: relative;
`;

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
`;

const BtnsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
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

const FormSC = styled(Form)`
  display: grid;
  grid-template-columns: 300px;
  justify-content: center;
  gap: 5px;
`;
const Btn = styled.div`
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

const ErrorInput = styled.span`
  color: ${({ theme }) => theme.errorMsg};
`;

const CreateTranslationAppModal = ({ closeModal }) => {
  const sendNotif = useNotification();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ name, languages }) => {
      return translationToolAgent().createNewApp({ name, languages });
    },
    onSuccess: (data) => {
      sendNotif.SUCCESS("App created successfully");
      queryClient.invalidateQueries(["translationApps"]);
      closeModal();
    },
  });
  return (
    <Outer>
      {isLoading && <Loader />}
      <TitleRow>
        <div />
        <FormTitle>Change Account Leverage</FormTitle>
        <BtnsContainer>
          <BtnClose onClick={() => closeModal()}>
            <FaTimes />
          </BtnClose>
        </BtnsContainer>
      </TitleRow>
      <Formik
        initialValues={{
          name: "",
          languages: [],
        }}
        validationSchema={yup.object({
          name: yup.string().required("Required"),
          languages: yup.array(),
        })}
        onSubmit={(values, { setErrors }) => {
          if (!isLoading)
            mutate(values, {
              onError: (err) => {
                if (err?.response?.data?.errors)
                  setErrors({ form: err.response.data.errors });
                else setErrors({ form: "Something went wrong" });
                sendNotif.ERROR("Something went wrong");
              },
            });
        }}
      >
        {({ setFieldTouched, setFieldValue, values, errors }) => (
          <FormSC>
            <Label>
              New App Name{" "}
              {errors.name && <ErrorInput>- {errors.name}</ErrorInput>}
            </Label>
            <InputField
              type="text"
              name="name"
              placeholder="Type new app name"
              value={values.name}
              onChange={(ev) => {
                setFieldTouched("name", true);
                setFieldValue("name", _.camelCase(ev.target.value));
              }}
            />
            <ManageLang
              name="languages"
              onChange={(e) => {
                setFieldTouched("languages", true);
                setFieldValue("languages", e?.map((lang) => lang.code) ?? []);
              }}
            />
            {errors.form && <ErrorInput>{errors.form}</ErrorInput>}
            <ActionButton type="submit">Create</ActionButton>
          </FormSC>
        )}
      </Formik>
    </Outer>
  );
};

export default CreateTranslationAppModal;
