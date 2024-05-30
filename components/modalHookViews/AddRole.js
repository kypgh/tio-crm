import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";

import agent from "../../utils/agent";
import {
  FormTitle,
  Label,
  InputField,
  ButtonContainer,
} from "../formComponents/FormGeneric";
import { ActionButton, Loader } from "../generic";
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

const AddRole = ({ closeModal }) => {
  const theme = useTheme();

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleNameError, setRoleNameError] = useState(false);
  const actionNotification = useNotification();

  const queryClient = useQueryClient();

  const [selectedBrand] = useSelectedBrand();

  const createPermissionsRole = useMutation(
    ({ roleName, selectedPermissions }) =>
      agent().createPermissionsRole(roleName, selectedPermissions),
    {
      onSuccess: () => {
        actionNotification.SUCCESS("Role created successfully");
        queryClient.invalidateQueries([selectedBrand, "crmUsersRoles"]);
        closeModal();
      },
      mutationKey: "createPermissionsRole",
    }
  );

  // if (isLoading || isFetching)
  //   return (
  //     <Outer>
  //       <Loader />
  //     </Outer>
  //   );

  return (
    <Outer>
      {createPermissionsRole.isLoading && <Loader />}
      <FormTitle>Add Role</FormTitle>
      <Label>Role Name</Label>
      <InputField
        style={{ textTransform: "capitalize" }}
        onChange={(e) => {
          setRoleName(e.target.value);
          setRoleNameError(false);
        }}
      />
      {roleNameError && (
        <Label style={{ color: theme.errorMsg, fontSize: "14px" }}>
          Role name is required
        </Label>
      )}
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
          if (roleName.length > 2) {
            createPermissionsRole.mutate({
              roleName,
              selectedPermissions,
            });
          } else {
            setRoleNameError(true);
          }
        }}
      >
        Add Role
      </ActionButton>
    </Outer>
  );
};

export default AddRole;
