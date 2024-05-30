import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { colors } from "../../config/colors";
import agent from "../../utils/agent";
import { ActionButton, Loader, Switch } from "../generic";
import {
  FormTitle,
  Label,
  ErrorMessage,
  ButtonContainer,
  InputField,
  Select,
} from "../formComponents/FormGeneric";
import { Permission } from "./EditCrmUser";
import { useNotification } from "../actionNotification/NotificationProvider";
import { CRM_USER_DEPARTMENTS } from "../../config/enums";
import {
  useAvailablePermissions,
  useUserRoles,
} from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import {
  PERMISSIONS,
  PERMISSIONS_CATEGORIES,
  PERMISSIONS_LIST,
} from "../../config/permissions";

const Outer = styled.div`
  max-width: 850px;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  padding: 40px 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  & form {
    width: 100%;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    gap: 15px;
  }
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  border: 1px solid ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: 0.3s all ease;
  transition: 0.3s all ease;

  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    color: ${({ theme }) => theme.black};
  }
`;

const HalfSide = styled.div`
  max-width: calc(50% - (15px / 2));
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  max-height: 340px;
  height: 100%;
  overflow-y: auto;
  gap: 3px;
  padding: 3px 5px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;

  & > p {
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

const CategoryName = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  & > p {
    color: ${({ theme }) => theme.textSecondary};
    font-weight: 900;
    font-size: 12px;
    letter-spacing: 0.05rem;
    padding-left: 5px;
  }
`;

function CreateCrmUser({ closeModal, params }) {
  const createUserSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().matches().label("Password"),
    first_name: Yup.string().required().label("First Name"),
    last_name: Yup.string().required().label("Last Name"),
    department: Yup.string().required().label("Department"),
    roleId: Yup.string().required().label("Role"),
  });

  const [errorState, setErrorState] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedBrand] = useSelectedBrand();

  const queryClient = useQueryClient();

  const availableDepartments = Object.values(CRM_USER_DEPARTMENTS);

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const actionNotification = useNotification();

  const {
    data: roles,
    isLoading: rolesLoading,
    isFetching: rolesFetching,
  } = useUserRoles({
    onSuccess: (data) => {
      setSelectedPermissions(
        data.roles.find((x) => x.name === "default").permissions
      );
    },
  });

  const createCrmUser = useMutation((values) => agent().createCrmUser(values));

  const addPermissionsToCrmUser = useMutation(
    ({ crmUserId, permissions }) =>
      agent().addPermissionToCrmUser(crmUserId, permissions),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([selectedBrand, "crmUsers"]);
        actionNotification.SUCCESS("User permissions added successfully");
        closeModal();
      },
      onError: (error) => {
        actionNotification.ERROR("Error adding user permissions");
        closeModal();
      },
    }
  );

  useEffect(() => {
    if (roles) {
      setSelectedPermissions(
        roles.roles.find((x) => x.name === "default").permissions
      );
    }
  }, [roles]);

  if (rolesLoading || rolesFetching) {
    return (
      <Outer>
        <Loader />
      </Outer>
    );
  }

  return (
    <Outer>
      <FormTitle>Create CRM User</FormTitle>
      <Formik
        initialValues={{
          email: "",
          password: "",
          first_name: "",
          last_name: "",
          department: "",
          roleId: "",
          permissions: [],
        }}
        validateOnChange={false}
        validationSchema={createUserSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (selectedPermissions.length === 0) {
            setErrorState(true);
            setErrorMsg("Please select at least one permission");
            setSubmitting(false);
            return;
          }
          createCrmUser.mutate(
            { ...values, permissions: selectedPermissions },
            {
              onSuccess: (res) => {
                // addPermissionsToCrmUser.mutate({
                //   crmUserId: res.data.user._id,
                //   permissions: selectedPermissions,
                // });
                queryClient.invalidateQueries([selectedBrand, "crmUsers"]);
                setSubmitting(false);
                actionNotification.SUCCESS("User created successfully");
              },
              onError: (err) => {
                setErrorState(true);
                setSubmitting(false);
                setErrorMsg(err.response.data.details[0].message);
              },
            }
          );
        }}
      >
        {({ handleSubmit, isSubmitting, errors, setFieldValue, values }) => (
          <>
            {(isSubmitting || createCrmUser.isLoading) && <Loader />}
            <form>
              <HalfSide>
                <Label>Email:</Label>
                <InputField
                  smallStyles
                  type="email"
                  name="email"
                  onChange={(e) => {
                    setFieldValue("email", e.target.value);
                    setErrorState(false);
                  }}
                />
                <ErrorMessage>{errors.email}</ErrorMessage>
                <Label>Password:</Label>
                <InputField
                  smallStyles
                  autoComplete="one-time-code"
                  type="password"
                  name="password"
                  onChange={(e) => {
                    setFieldValue("password", e.target.value);
                    setErrorState(false);
                  }}
                />
                <ErrorMessage>{errors.password}</ErrorMessage>
                <Label>First Name:</Label>
                <InputField
                  smallStyles
                  type="text"
                  name="first_name"
                  onChange={(e) => {
                    setFieldValue("first_name", e.target.value);
                    setErrorState(false);
                  }}
                />
                <ErrorMessage>{errors.first_name}</ErrorMessage>
                <Label>Last Name:</Label>
                <InputField
                  smallStyles
                  type="text"
                  name="last_name"
                  onChange={(e) => {
                    setFieldValue("last_name", e.target.value);
                    setErrorState(false);
                  }}
                />
                <ErrorMessage>{errors.last_name}</ErrorMessage>
                <Label>Department:</Label>
                <Select
                  onChange={(e) => setFieldValue("department", e.target.value)}
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                    style={{ textTransform: "capitalize" }}
                  >
                    Select
                  </option>
                  {availableDepartments.map((department) => (
                    <option
                      key={department}
                      value={department}
                      style={{ textTransform: "capitalize" }}
                    >
                      {department}
                    </option>
                  ))}
                </Select>
                <ErrorMessage>{errors.department}</ErrorMessage>
                <Label>Role:</Label>
                <Select
                  value={values.roleId}
                  onChange={(e) => {
                    setFieldValue("roleId", e.target.value);
                  }}
                >
                  <option disabled value="">
                    Select
                  </option>
                  {roles.roles.map((el, idx) => (
                    <option key={idx} value={el._id}>
                      {el.name}
                    </option>
                  ))}
                </Select>
                <ErrorMessage>{errors.roleId}</ErrorMessage>
              </HalfSide>
              <HalfSide>
                <PermTitleContainer>
                  <Label style={{ alignSelf: "center" }}>Permissions</Label>
                  <ButtonContainer>
                    <ActionButton
                      invert
                      type="button"
                      onClick={() => setSelectedPermissions(PERMISSIONS_LIST)}
                    >
                      Select All
                    </ActionButton>
                    <ActionButton
                      invert
                      type="button"
                      onClick={() => setSelectedPermissions([])}
                    >
                      Clear All
                    </ActionButton>
                  </ButtonContainer>
                </PermTitleContainer>
                <PermissionsContainer>
                  {PERMISSIONS_CATEGORIES.map((category, kreper) => (
                    <React.Fragment key={kreper}>
                      <CategoryName>
                        <p>{category}</p>
                        <Switch
                          invert
                          checked={Object.values(PERMISSIONS[category]).every(
                            (el) => selectedPermissions.includes(el)
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const permissionsToAdd = Object.values(
                                PERMISSIONS[category]
                              ).filter(
                                (el) => !selectedPermissions.includes(el)
                              );
                              setSelectedPermissions([
                                ...selectedPermissions,
                                ...permissionsToAdd,
                              ]);
                            } else {
                              setSelectedPermissions(
                                selectedPermissions.filter(
                                  (x) =>
                                    !Object.values(
                                      PERMISSIONS[category]
                                    ).includes(x)
                                )
                              );
                            }
                          }}
                        />
                      </CategoryName>
                      {Object.values(PERMISSIONS[category]).map((x, idx) => (
                        <Permission
                          description={x.description}
                          title={x.label}
                          category={category}
                          key={idx}
                          checked={selectedPermissions.includes(x)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions((prev) => [...prev, x]);
                            } else {
                              setSelectedPermissions((prev) =>
                                prev.filter((y) => y !== x)
                              );
                            }
                          }}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </PermissionsContainer>
              </HalfSide>
              <ButtonContainer>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || addPermissionsToCrmUser.isLoading}
                >
                  Create User
                </Button>
              </ButtonContainer>
              {errorState && (
                <ErrorMessage style={{ textAlign: "center", width: "100%" }}>
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

export default CreateCrmUser;
