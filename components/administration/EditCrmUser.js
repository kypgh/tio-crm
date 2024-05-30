import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  FormTitle,
  Label,
  ErrorMessage,
  ButtonContainer,
  InputField,
  SumbitButton,
  Select,
} from "../formComponents/FormGeneric";

import agent from "../../utils/agent";
import { ActionButton, Loader, Switch } from "../generic";
import { useNotification } from "../actionNotification/NotificationProvider";
import { CRM_USER_DEPARTMENTS } from "../../config/enums";
import PCR from "../PCR";
import {
  useAvailablePermissions,
  useUserRoles,
} from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import useUser from "../../utils/hooks/useUser";
import { PERMISSIONS, PERMISSIONS_LIST } from "../../config/permissions";

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
  font-size: 16px;
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

const PermissionOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 5px;
`;

const PermOutest = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px 5px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  color: ${({ theme }) => theme.textPrimary};

  & > p {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 12px;
    font-weight: 700;
  }
`;

const FullSide = styled.div`
  max-width: 100%;
  width: 100%;
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

export const Permission = ({
  title,
  description,
  checked,
  onChange,
  category = "",
}) => {
  return (
    <PermOutest>
      <PermissionOuter>
        <Switch id={title} checked={checked} onChange={onChange} />
        <label
          style={{ cursor: "pointer", display: "flex", flex: "1 1 auto" }}
          htmlFor={title}
        >
          {title?.replace(category.toLowerCase() + ".", "")}
        </label>
      </PermissionOuter>
      <p>{description}</p>
    </PermOutest>
  );
};

function EditCrmUser({ user, closeModal, params }) {
  const editUserSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().matches().label("Password"),
    first_name: Yup.string().required().label("First Name"),
    last_name: Yup.string().required().label("Last Name"),
    department: Yup.string().required().label("Department"),
  });
  const [errorState, setErrorState] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const availableDepartments = Object.values(CRM_USER_DEPARTMENTS);
  const queryClient = useQueryClient();
  const actionNotification = useNotification();
  const [selectedBrand] = useSelectedBrand();
  const currentUser = useUser();
  const [checkedPermissions, setCheckedPermissions] = useState(
    user?.permissions || []
  );
  const {
    data: roles,
    isLoading: rolesLoading,
    isFetching: rolesFetching,
  } = useUserRoles();

  const editCrmUser = useMutation(
    ({ updatedUser, permissions }) => {
      let permissionsToAdd = permissions.filter(
        (permission) =>
          !user.permissions.includes(permission) &&
          PERMISSIONS_LIST.includes(permission)
      );
      let permissionsToRemove = user.permissions.filter(
        (permission) =>
          !permissions.includes(permission) &&
          PERMISSIONS_LIST.includes(permission)
      );
      return Promise.all([
        agent().editCrmUser(user._id, updatedUser),
        agent().addPermissionToCrmUser(user._id, permissionsToAdd),
        agent().removePermissionFromCrmUser(user._id, permissionsToRemove),
      ]);
    },
    {
      onSuccess: async (res) => {
        if (user._id === currentUser.data?.user?._id) {
          await agent()
            .refreshAccessToken()
            .catch((err) => console.error(err));
        }
        queryClient.invalidateQueries([selectedBrand, "crmUsers"]);
        actionNotification.SUCCESS("User updated successfully");
      },
      onError: (error) => {
        actionNotification.ERROR("Error updating user");
        console.error(error);
      },
      mutationKey: ["editCrmUser", user._id],
    }
  );

  if (rolesLoading || rolesFetching)
    return (
      <Outer>
        <Loader />
      </Outer>
    );

  return (
    <Outer>
      <FormTitle style={{ width: "100%" }}>Edit CRM User</FormTitle>
      <Formik
        initialValues={{
          email: user.email,
          password: "",
          first_name: user.first_name,
          last_name: user.last_name,
          department: user.department,
          role: user.role._id,
        }}
        validationSchema={editUserSchema}
        onSubmit={(values, { setSubmitting }) => {
          const notEmptyValues = Object.fromEntries(
            Object.entries(values).filter(
              (e) => e[1] !== "" && e[0] !== "permissions"
            )
          );
          editCrmUser.mutate(
            { updatedUser: notEmptyValues, permissions: checkedPermissions },
            {
              onError: (err) => {
                setErrorState(true);
                setErrorMsg(err.response.data.details[0].message);
              },
              onSettled: () => {
                setSubmitting(false);
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
          values,
        }) => (
          <>
            {isSubmitting && <Loader />}
            <form>
              <HalfSide>
                <Label>Email:</Label>
                <InputField
                  smallStyles
                  type="email"
                  name="email"
                  value={getFieldProps("email").value}
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
                  value={getFieldProps("first_name").value}
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
                  value={getFieldProps("last_name").value}
                  onChange={(e) => {
                    setFieldValue("last_name", e.target.value);
                    setErrorState(false);
                  }}
                />
                <ErrorMessage>{errors.last_name}</ErrorMessage>
                <Label>Department:</Label>
                <Select
                  onLoad={(e) => setFieldValue("department", e.target.value)}
                  onChange={(e) => setFieldValue("department", e.target.value)}
                  defaultValue={getFieldProps("department").value}
                  style={{ textTransform: "capitalize" }}
                >
                  {availableDepartments.map((department, idx) => (
                    <option
                      key={idx}
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
                  value={values.role}
                  onChange={(e) => {
                    setFieldValue("role", e.target.value);
                  }}
                >
                  <option disabled value="custom">
                    Custom
                  </option>
                  {roles.roles.map((el, idx) => (
                    <option key={idx} value={el._id}>
                      {el.name}
                    </option>
                  ))}
                </Select>
              </HalfSide>
              <PCR.updateCrmUserPermissions>
                <HalfSide>
                  <PermTitleContainer>
                    <Label style={{ alignSelf: "center" }}>Permissions</Label>
                    <ButtonContainer>
                      <ActionButton
                        invert
                        onClick={() =>
                          setCheckedPermissions(
                            Array.from(
                              new Set(
                                Object.keys(PERMISSIONS)
                                  .map((element, index) =>
                                    Object.values(PERMISSIONS[element]).map(
                                      ({ value }) => value
                                    )
                                  )
                                  .flat()
                              )
                            )
                          )
                        }
                      >
                        Select All
                      </ActionButton>
                      <ActionButton
                        invert
                        onClick={() => setCheckedPermissions([])}
                      >
                        Clear All
                      </ActionButton>
                    </ButtonContainer>
                  </PermTitleContainer>
                  <PermissionsContainer>
                    {Object.keys(PERMISSIONS).map((category, kreper) => (
                      <React.Fragment key={kreper}>
                        <CategoryName>
                          <p>{category}</p>

                          <Switch
                            invert
                            checked={Object.values(PERMISSIONS[category])
                              .map(({ value }) => value)
                              .every((el) => checkedPermissions?.includes(el))}
                            onChange={(e) => {
                              const categoryValues = Object.values(
                                PERMISSIONS[category]
                              ).map(({ value }) => value);

                              if (!e.target.checked) {
                                setCheckedPermissions((prev) =>
                                  prev.filter(
                                    (a) => !categoryValues.includes(a)
                                  )
                                );
                              } else {
                                setCheckedPermissions((prev) =>
                                  Array.from(
                                    new Set([...prev, ...categoryValues])
                                  )
                                );
                              }
                            }}
                          />
                        </CategoryName>

                        {Object.values(PERMISSIONS[category]).map((x, idx) => (
                          <Permission
                            title={x.label}
                            description={x.description}
                            category={category}
                            key={idx}
                            checked={
                              checkedPermissions?.includes(x.value) || false
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCheckedPermissions((prev) =>
                                  Array.from(new Set([...prev, x.value]))
                                );
                              } else {
                                setCheckedPermissions((prev) =>
                                  prev.filter((a) => a !== x.value)
                                );
                              }
                            }}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </PermissionsContainer>
                </HalfSide>
              </PCR.updateCrmUserPermissions>
              <FullSide>
                <ButtonContainer>
                  <SumbitButton onClick={handleSubmit} disabled={isSubmitting}>
                    Save
                  </SumbitButton>
                </ButtonContainer>
                {errorState && (
                  <ErrorMessage
                    style={{ textAlign: "center", width: "100%", fontSize: 16 }}
                  >
                    {errorMsg}
                  </ErrorMessage>
                )}
              </FullSide>
            </form>
          </>
        )}
      </Formik>
    </Outer>
  );
}

export default EditCrmUser;
