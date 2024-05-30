import React from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { Formik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../actionNotification/NotificationProvider";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import agent from "../../utils/agent";
import {
  FormTitle,
  InputField,
  Label,
  SumbitButton,
} from "../formComponents/FormGeneric";

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

const BtnContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.errorMsg};
  font-size: 14px;
  min-height: 20px;
`;

const EditEmail = ({ client, closeModal }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Required").label("Email"),
  });

  const queryClient = useQueryClient();
  const actionNotification = useNotification();
  const [selectedBrand] = useSelectedBrand();

  const changeEmail = useMutation(
    (email) => agent().changeClientEmail(client._id, email),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries([selectedBrand, "client", client._id])
          .then(() => closeModal());
        actionNotification.SUCCESS("Client updated successfully");
      },
      mutationKey: ["editEmail"],
    }
  );

  return (
    <Outer>
      <FormTitle>Edit Email</FormTitle>
      <Formik
        initialValues={{
          email: client.email,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (values.email === client.email) {
            actionNotification.WARNING("Email is the same as before");
            return;
          }
          changeEmail.mutate(values.email, {
            onError: (err) => {
              setSubmitting(false);
            },
          });
        }}
      >
        {({ handleSubmit, errors, handleChange, getFieldProps }) => (
          <form>
            <Label htmlFor="email">Email</Label>
            <InputField
              type="email"
              {...getFieldProps("email")}
              placeholder="Email"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <ErrorMsg>{errors.email}</ErrorMsg>

            <BtnContainer>
              <SumbitButton
                type="submit"
                disabled={changeEmail.isLoading}
                isLoading={changeEmail.isLoading}
                onClick={handleSubmit}
              >
                Save
              </SumbitButton>
              <SumbitButton
                type="button"
                onClick={() => {
                  closeModal();
                }}
              >
                Cancel
              </SumbitButton>
            </BtnContainer>
          </form>
        )}
      </Formik>
    </Outer>
  );
};

export default EditEmail;
