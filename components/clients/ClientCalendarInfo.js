import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { Formik } from "formik";
import "yup-phone";
import {
  FormTitle,
  Label,
  ErrorMessage,
  ButtonContainer,
  SumbitButton,
  Select,
  InputField,
} from "../formComponents/FormGeneric";
import { colors } from "../../config/colors";
import { Loader } from "../generic";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { CALENDAR_EVENT_TYPES } from "../../config/enums";
import { DatePicker } from "../formComponents/FormGeneric";
import { set } from "nprogress";

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

const HorContainer = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const FullContainer = styled.div`
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;
const dateForDateTimeInputValue = (date) =>
  new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000)
    .toISOString()
    .slice(0, 19);
export default function ClientCalendarInfo({
  client,
  closeModal,
  start,
  end,
  modalData,
}) {
  const [errorState, setErrorState] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const calendarSchema = Yup.object().shape({
    title: Yup.string().required(),
    type: Yup.string().required(),
    startDate: Yup.string().required(),
    endDate: Yup.string().required(),
  });

  const queryClient = useQueryClient();
  const notify = useNotification();
  const [selectedBrand] = useSelectedBrand();

  const updateCalnedar = useMutation(
    ({ type, startDate, endDate, title }) =>
      agent().addUserCalendarEvents({
        type,
        startDate,
        endDate,
        client,
        selectedBrand,
        title,
      }),
    {
      onSuccess: () => {
        notify.SUCCESS("Calendar updated successfully");
        queryClient
          .invalidateQueries([
            selectedBrand,
            "getUserCalendarEvents",
            client._id,
            start.valueOf(),
            end.valueOf(),
          ])
          .then(() => closeModal());
      },
      onError: (err) => {
        setErrorState(true);
        setErrorMsg(err.response.data.message);
      },
      mutationKey: ["updateCalnedar" + client._id + "calendar"],
    }
  );
  return (
    <Outer>
      <Formik
        initialValues={{
          type: "",
          startDate: modalData
            ? dateForDateTimeInputValue(modalData.toJSDate())
            : "",
          endDate: "",
          title: "",
        }}
        enableReinitialize
        validationSchema={calendarSchema}
        onSubmit={(values, { setSubmitting }) => {
          updateCalnedar.mutate({
            title: values.title,
            type: values.type,
            startDate: values.startDate,
            endDate: values.endDate,
          });
        }}
      >
        {({ handleSubmit, isSubmitting, errors, values, handleChange }) => (
          <>
            {updateCalnedar.isLoading && <Loader />}
            <form>
              <BtnContainer>
                <FormTitle>Client Follow Up</FormTitle>
              </BtnContainer>
              <HorContainer>
                <FullContainer>
                  <Label>Title:</Label>
                  <InputField
                    style={{ width: "290px" }}
                    type="text"
                    name="title"
                    value={values.title}
                    onFocus={(e) => {
                      e.target.value = "";
                    }}
                    onChange={handleChange}
                  />
                  <ErrorMessage>{errors.title}</ErrorMessage>

                  <Label>Type</Label>
                  <Select
                    style={{ height: "40px", width: "100%" }}
                    defaultValue={values.type}
                    onChange={handleChange}
                    name="type"
                  >
                    <option value={""} disabled>
                      Please Select
                    </option>
                    {Object.values(CALENDAR_EVENT_TYPES).map((el, idx) => (
                      <option key={idx} value={el}>
                        {`${el}`}
                      </option>
                    ))}
                  </Select>
                  <ErrorMessage>{errors.type}</ErrorMessage>
                  <Label>Start Date</Label>
                  <DatePicker
                    style={{ height: "40px", width: "100%" }}
                    name={"startDate"}
                    value={values.startDate}
                    type="datetime-local"
                    onChange={handleChange}
                  />
                  <ErrorMessage>{errors.startDate}</ErrorMessage>

                  <Label>End Date</Label>
                  <DatePicker
                    style={{ height: "40px", width: "100%" }}
                    name={"endDate"}
                    value={values.endDate}
                    type="datetime-local"
                    onChange={handleChange}
                  />
                  <ErrorMessage>{errors.endDate}</ErrorMessage>
                </FullContainer>
              </HorContainer>

              <BtnContainer>
                <ButtonContainer>
                  <SumbitButton onClick={handleSubmit} disabled={isSubmitting}>
                    Save
                  </SumbitButton>
                </ButtonContainer>
                <ButtonContainer>
                  <SumbitButton
                    onClick={() => {
                      console.log("here");
                      closeModal();
                    }}
                    type="button"
                    disabled={isSubmitting}
                  >
                    close
                  </SumbitButton>
                </ButtonContainer>
              </BtnContainer>

              {errorState && (
                <ErrorMessage style={{ alignSelf: "center" }}>
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
