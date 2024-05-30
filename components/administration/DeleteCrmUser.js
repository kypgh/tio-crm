import React from "react";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { FormTitle, Label } from "../formComponents/FormGeneric";
import { colors } from "../../config/colors";
import agent from "../../utils/agent";
import { Loader } from "../generic";
import { useNotification } from "../actionNotification/NotificationProvider";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Outer = styled.div`
  max-width: 850px;
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

const DetailsContainer = styled.div`
  max-width: 500px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Details = styled.div`
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 3px 10px;
  width: 100%;
  color: ${({ theme }) => theme.white};
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Btn = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  border-radius: 5px;
  width: 100px;
  padding: 3px 5px;
  text-align: center;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &.red {
    background-color: ${({ theme }) => theme.errorMsg};
  }
`;

function DeleteCrmUser({ user, closeModal, params }) {
  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const [selectedBrand] = useSelectedBrand();

  const deleteCrmUser = useMutation(() => agent().deleteCrmUser(user._id), {
    onSuccess: () => {
      queryClient
        .invalidateQueries([selectedBrand, "crmUsers"])
        .then(() => closeModal());
      actionNotification.WARNING("User deleted successfully");
    },
    mutationKey: ["deleteCrmUser"],
  });
  return (
    <Outer>
      {deleteCrmUser.isLoading && <Loader />}
      <FormTitle>Are you sure you want to delete this user?</FormTitle>
      {user && (
        <DetailsContainer>
          <Label>First Name:</Label>
          <Details>{user.first_name}</Details>
          <Label>Last Name:</Label>
          <Details>{user.last_name}</Details>
          <Label>Email:</Label>
          <Details>{user.email}</Details>
          <Label>Department:</Label>
          <Details>{user.department}</Details>
        </DetailsContainer>
      )}
      <ButtonContainer>
        <Btn onClick={() => deleteCrmUser.mutate()} className="red">
          Delete
        </Btn>
        <Btn onClick={() => closeModal()}>Cancel</Btn>
      </ButtonContainer>
    </Outer>
  );
}

export default DeleteCrmUser;
