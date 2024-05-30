import React from "react";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { FormTitle } from "../formComponents/FormGeneric";
import { Form, Formik } from "formik";
import FInputMultiselect from "../FromikInputs/FInputMultiselect";
import FInputTogglePill from "../FromikInputs/FInputTogglePill";
import { ActionButton, Loader } from "../generic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 700px;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  position: relative;
  color: ${({ theme }) => theme.white};
`;

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
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

const BtnsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const FormSc = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DisabledOverlay = styled.div`
  background-color: ${({ theme }) => theme.primary};
  opacity: 0.5;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const InfoSection = styled.div`
  background-color: ${({ theme }) => theme.primary};
  padding: 10px;
  border-radius: 5px;
  & span {
    color: ${({ theme }) => theme.brand};
  }
`;

const EditCrmUserWhitelistCountries = ({ user, closeModal }) => {
  const sendNotif = useNotification();
  const queryClient = useQueryClient();
  const [selectedBrand] = useSelectedBrand();
  const { mutate, isLoading } = useMutation(
    (values) =>
      agent()
        .updateCrmUserWhitelistCountries(user._id, values)
        .then(async (res) => {
          if (res.data?.permissions?.crmuserId === user._id) {
            await agent().refreshAccessToken();
          }
          return res.data;
        }),
    {
      onSuccess: async () => {
        sendNotif.SUCCESS("User whitelist countries updated");
        queryClient.invalidateQueries([selectedBrand, "crmUsers"]);
        closeModal();
      },
      onError: () => {
        sendNotif.ERROR("Failed to update user whitelist countries");
      },
    }
  );

  return (
    <Container>
      {isLoading && <Loader />}
      <TitleRow>
        <div />
        <Title>Country Whitelist:</Title>
        <BtnsContainer>
          <BtnClose onClick={() => closeModal()}>
            <FaTimes />
          </BtnClose>
        </BtnsContainer>
      </TitleRow>
      <InfoSection>
        <p>
          Setup country whitelist for user: ({user.first_name} {user.last_name})
        </p>
        <p>
          <span>{user.email}</span>
        </p>
      </InfoSection>
      <Formik
        initialValues={{
          enable_country_whitelist: user.enable_country_whitelist,
          whitelist_countries: user.whitelist_countries,
        }}
        onSubmit={(values) => {
          mutate(values);
        }}
      >
        {({ values }) => (
          <FormSc>
            <FInputTogglePill
              label="Enable Country Whitelist"
              name="enable_country_whitelist"
            />
            <div style={{ position: "relative" }}>
              {!values.enable_country_whitelist && <DisabledOverlay />}
              <FInputMultiselect
                label="Whitelisted Countries"
                name="whitelist_countries"
              />
            </div>
            <ActionButton type="submit">Save</ActionButton>
          </FormSc>
        )}
      </Formik>
    </Container>
  );
};

export default EditCrmUserWhitelistCountries;
