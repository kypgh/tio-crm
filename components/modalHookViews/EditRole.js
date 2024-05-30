import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

import { colors } from "../../config/colors";
import {
  ButtonContainer,
  FormTitle,
  Label,
} from "../formComponents/FormGeneric";
import { ActionButton, Loader } from "../generic";
import agent from "../../utils/agent";
import { Permission } from "../administration/EditCrmUser";
import { useNotification } from "../actionNotification/NotificationProvider";
import { useAvailablePermissions } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { PERMISSIONS, PERMISSIONS_LIST } from "../../config/permissions";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-height: 150px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 3px;
  padding: 10px;
  position: relative;
  max-width: 700px;
  position: relative;
`;

const PermTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PermissionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 259px;
  height: 100%;
  overflow-y: auto;
  gap: 3px;
  padding: 3px 5px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;

  & p {
    color: ${({ theme }) => theme.textSecondary};
    font-weight: 900;
    font-size: 12px;
    letter-spacing: 0.05rem;
    padding-left: 5px;
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

const EditRole = ({ roleID, preselectedPermissions, roleName, closeModal }) => {
  const [selectedPermissions, setSelectedPermissions] = useState(
    preselectedPermissions
  );

  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const [selectedBrand] = useSelectedBrand();

  const updateRole = useMutation(
    ({ roleID, permissions }) => {
      let permissionsToAdd = permissions.filter(
        (permission) => !preselectedPermissions.includes(permission)
      );
      let permissionsToRemove = preselectedPermissions.filter(
        (permission) => !permissions.includes(permission)
      );
      return Promise.all([
        agent().addPermissionsToRole(roleID, permissionsToAdd),
        agent().removePermissionsFromRole(roleID, permissionsToRemove),
      ]);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "crmUsersRoles"]);
        actionNotification.SUCCESS("Role updated");
        closeModal();
      },
      mutationKey: ["updateRole", roleID],
    }
  );

  return (
    <Outer>
      {updateRole.isLoading && <Loader />}
      <FormTitle>Edit Role</FormTitle>
      <Label>{roleName}</Label>

      <PermTitleContainer>
        <Label>Permissions</Label>
        <ButtonContainer>
          <ActionButton
            invert
            onClick={() => setSelectedPermissions(PERMISSIONS_LIST)}
          >
            Select All
          </ActionButton>
          <ActionButton invert onClick={() => setSelectedPermissions([])}>
            Clear All
          </ActionButton>
        </ButtonContainer>
      </PermTitleContainer>
      <PermissionsContainer>
        {Object.keys(PERMISSIONS).map((category, kreper) => (
          <React.Fragment key={kreper}>
            <p>{category}</p>
            {Object.values(PERMISSIONS[category]).map((el, idx) => (
              <Permission
                title={el.label}
                description={el.description}
                key={idx}
                category={category}
                checked={selectedPermissions.includes(el.value)}
                onChange={() => {
                  if (selectedPermissions.includes(el.value)) {
                    setSelectedPermissions(
                      selectedPermissions.filter(
                        (permission) => permission !== el.value
                      )
                    );
                  } else {
                    setSelectedPermissions([...selectedPermissions, el.value]);
                  }
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </PermissionsContainer>
      <ActionButton
        style={{ maxWidth: "100px", margin: "auto" }}
        invert
        onClick={() => {
          updateRole.mutate({ roleID, permissions: selectedPermissions });
        }}
      >
        Update Role
      </ActionButton>
    </Outer>
  );
};

export default EditRole;
