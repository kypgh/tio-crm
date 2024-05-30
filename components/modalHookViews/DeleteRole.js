import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../utils/agent";
import styled from "styled-components";

import { colors } from "../../config/colors";
import {
  FormTitle,
  ButtonContainer,
  SumbitButton,
  Label,
} from "../formComponents/FormGeneric";
import { Loader } from "../generic";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  position: relative;
  max-width: 700px;
`;

const DeleteRole = ({ roleID, closeModal, roleName }) => {
  const queryClient = useQueryClient();

  const [selectedBrand] = useSelectedBrand();

  const deleteRole = useMutation((roleID) => agent().deleteRole(roleID), {
    onSuccess: () => {
      queryClient.invalidateQueries([selectedBrand, "crmUsersRoles"]);
      closeModal();
    },
  });

  return (
    <Outer>
      {deleteRole.isLoading && <Loader />}
      <FormTitle>Are you sure you want to delete this role</FormTitle>
      <Label style={{ margin: "auto" }}>{roleName}</Label>
      <ButtonContainer>
        <SumbitButton onClick={() => deleteRole.mutate(roleID)}>
          Delete
        </SumbitButton>
        <SumbitButton onClick={() => closeModal()}>Cancel</SumbitButton>
      </ButtonContainer>
    </Outer>
  );
};

export default DeleteRole;
