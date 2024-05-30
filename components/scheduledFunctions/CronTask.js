import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FaCaretDown,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMinus,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import styled, { useTheme } from "styled-components";
import { colors } from "../../config/colors";
import scheduledFunctionsAgent from "../../utils/scheduledFunctionsAgent";
import { useNotification } from "../actionNotification/NotificationProvider";
import { ButtonBlue, Loader } from "../generic";
import CronTaskResults from "./CronTaskResults";
import cronstrue from "cronstrue";
import useDebounce from "../../utils/hooks/useDebounce";
import { Formik } from "formik";
import CronTaskForceRunButton from "./CronTaskForceRunButton";
import * as yup from "yup";
import { useWindowSize } from "usehooks-ts";

const CronTaskContainer = styled.div`
  background-color: transparent;
`;

const CronTaskHeader = styled.div`
  width: 100%;
  padding: 2px;
  color: ${({ theme }) => theme.textPrimary};
  background-color: ${({ theme }) => theme.primary};
  border-radius: ${({ isExpanded }) =>
    isExpanded ? "5px 5px 0px 5px" : "5px 5px 5px 5px"};
  border: 5px solid ${({ theme }) => theme.primary};
  display: grid;
  grid-template-columns: 50px 4fr 2fr 4fr 1fr 1fr auto;
  gap: 2px;
  justify-content: stretch;
  align-items: stretch;
  width: 100%;
  text-align: start;
  & > * {
    background-color: ${({ theme }) => theme.secondary};
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 8px;
    overflow: hidden;
  }
  & > :first-child {
    justify-content: center;
  }

  & > :last-child,
  & > :nth-last-child(2) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    grid-template-columns: 2fr 2fr 2fr;
  }
`;

const ExpandIconContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.textPrimary};
  border-radius: 5px;
`;

const CronTaskEnabled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CronTaskEnabledBtn = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  border: none;
  ${({ isEdit, theme, value }) =>
    isEdit &&
    `cursor: pointer; 
      border: 1px solid ${value ? theme.success : theme.errorMsg};
      background-color: ${value ? theme.success : theme.errorMsg}20;`}
  & > :not(:last-child) {
    margin-right: 5px;
  }
`;

const TextInput = styled.input`
  background-color: ${({ theme }) => theme.primary};
  border: ${({ theme }) => `1px solid ${theme.secondaryFaded}`};
  color: ${({ theme }) => theme.textPrimary};
  border-radius: 5px;
  padding: 5px;
  width: 100%;
`;

const CronPatternCell = styled.div`
  display: flex;
  & > * {
    max-width: 50%;
  }
  & > :not(:last-child) {
    margin-right: 5px;
  }
`;

const FormButtonsContainer = styled.div`
  display: flex;
  & > :not(:last-child) {
    margin-right: 5px;
  }
`;

const TextErrorMessage = styled.p`
  font-size: small;
  font-weight: normal;
  color: ${({ theme }) => theme.errorMsg};
`;

const CronTaskHeaderForm = ({ cronTask, isExpanded, setIsExpanded }) => {
  const theme = useTheme();
  const [isEdit, setIsEdit] = useState(false);
  const queryClient = useQueryClient();
  const notification = useNotification();

  const { width } = useWindowSize();

  const updateCronMutation = useMutation(
    async (values) => {
      return scheduledFunctionsAgent().updateCronTask(cronTask.id, values);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["cronTasks"]);
        notification.SUCCESS("Task updated successfully");
        setIsEdit(false);
      },
      onError: (error) => {
        let errorMsg =
          error?.response?.data?.message ||
          "An error occurred while trying to update the task";
        notification.ERROR(errorMsg);
      },
    }
  );

  function displayCron(value) {
    try {
      if (value.split(" ").length === 6) {
        return cronstrue.toString(value, { verbose: true });
      }
    } catch (e) {}
    return <span style={{ color: theme.errorMsg }}>Invalid cron pattern</span>;
  }
  return (
    <Formik
      initialValues={{
        name: cronTask.name,
        cronPattern: cronTask.cronPattern,
        enabled: cronTask.enabled,
      }}
      enableReinitialize
      validationSchema={yup.object().shape({
        name: yup.string().min(3).required("Name is required"),
        cronPattern: yup
          .string()
          .test("split-count", "Input must have 6 parts", (value) => {
            const parts = value.split(" ");
            return parts.length === 6;
          })
          .required("Cron pattern is required"),
      })}
      validateOnChange
      onSubmit={(values, { resetForm }) => {
        updateCronMutation.mutate(values);
      }}
    >
      {({
        values,
        handleChange,
        resetForm,
        submitForm,
        setFieldValue,
        handleBlur,
        errors,
        touched,
      }) => (
        <form onSubmit={(ev) => ev.preventDefault()}>
          <CronTaskHeader
            isExpanded={isExpanded}
            onClick={() => setIsExpanded((v) => !v)}
          >
            {width > 768 && (
              <div>
                <ExpandIconContainer>
                  {isExpanded ? <FaMinus /> : <FaCaretDown />}
                </ExpandIconContainer>
              </div>
            )}
            <div>
              {!isEdit ? (
                <h3>{cronTask.name}</h3>
              ) : (
                <div style={{ width: "100%" }}>
                  <TextInput
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onClick={(e) => e.stopPropagation()}
                    autoComplete="off"
                  />
                  {errors.name && touched.name && (
                    <TextErrorMessage>Error: {errors.name}</TextErrorMessage>
                  )}
                </div>
              )}
            </div>
            <p>ID: {cronTask.functionId}</p>
            <CronPatternCell>
              {isEdit && (
                <TextInput
                  type="text"
                  name="cronPattern"
                  value={values.cronPattern}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onClick={(e) => e.stopPropagation()}
                  autoComplete="off"
                />
              )}
              <p>
                {!isEdit && "Scheduled"}
                {displayCron(values.cronPattern)}
              </p>
            </CronPatternCell>
            <CronTaskEnabled>
              <CronTaskEnabledBtn
                isEdit={isEdit}
                value={values.enabled}
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (isEdit) {
                    setFieldValue("enabled", !values.enabled);
                  }
                }}
              >
                {values.enabled ? (
                  <>
                    <FaCheckCircle color={theme.success} />
                    <p>Enabled</p>
                  </>
                ) : (
                  <>
                    <FaExclamationTriangle color={theme.errorMsg} />
                    <p>Disabled</p>
                  </>
                )}
              </CronTaskEnabledBtn>
            </CronTaskEnabled>
            <FormButtonsContainer>
              {isEdit ? (
                <>
                  <ButtonBlue
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      submitForm();
                    }}
                  >
                    <FaSave />
                  </ButtonBlue>
                  <ButtonBlue
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      resetForm();
                      setIsEdit((v) => !v);
                    }}
                  >
                    <FaTimes />
                  </ButtonBlue>
                </>
              ) : (
                <ButtonBlue
                  type="button"
                  onClick={(ev) => {
                    setIsEdit((v) => !v);
                    ev.stopPropagation();
                  }}
                >
                  Edit
                </ButtonBlue>
              )}
            </FormButtonsContainer>
            <div>
              <CronTaskForceRunButton cronTask={cronTask} />
            </div>
          </CronTaskHeader>
        </form>
      )}
    </Formik>
  );
};

const CronTask = ({ cronTask, theme, expandedSection, setExpandedSection }) => {
  const isExpanded = expandedSection === cronTask.id;
  const { debouncedValue } = useDebounce(isExpanded, 500);

  return (
    <CronTaskContainer>
      <CronTaskHeaderForm
        cronTask={cronTask}
        isExpanded={isExpanded}
        setIsExpanded={() =>
          setExpandedSection((prev) =>
            prev === cronTask.id ? null : cronTask.id
          )
        }
      />
      <CronTaskResults isExpanded={isExpanded} cronTask={cronTask} />
    </CronTaskContainer>
  );
};

export default CronTask;
