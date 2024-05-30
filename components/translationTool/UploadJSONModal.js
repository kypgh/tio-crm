import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import translationToolAgent from "../../utils/translationToolAgent";
import styled from "styled-components";
import { BtnGeneric, Loader } from "../generic";
import { FaTimes } from "react-icons/fa";
import FileUpload from "../common/FileUpload";
import { useNotification } from "../actionNotification/NotificationProvider";

const Container = styled.div`
  max-width: 500px;
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.white};
  padding: 20px 10px;
`;

const UploadContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
`;

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.textSecondary};
`;
const Title = styled.h3`
  text-align: center;
  & span {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 12px;
  }
`;
const UploadJSONModal = ({ app, closeModal }) => {
  const queryClient = useQueryClient();
  const sendNotif = useNotification();
  const { mutate, isLoading } = useMutation({
    mutationFn: (values) => translationToolAgent().uploadJSON(app?._id, values),
    onSuccess: () => {
      sendNotif.SUCCESS("JSON file uploaded successfully");
      queryClient.invalidateQueries("translation");
      closeModal();
    },
    onError: (err) => {
      sendNotif.ERROR("Something went wrong");
    },
  });
  return (
    <Container>
      <TitleRow>
        <div />
        <Title>
          <div>Upload a JSON file for app: {app?.name}</div>
          <span>this is only to update english values or add new keys</span>
        </Title>
        <BtnGeneric onClick={() => closeModal()}>
          <FaTimes />
        </BtnGeneric>
      </TitleRow>
      <UploadContainer>
        {isLoading && <Loader />}
        <FileUpload
          single
          validFileTypes={["application/json"]}
          onUpload={(files) => {
            return new Promise((resolve, reject) =>
              mutate(files[0], {
                onSuccess: () => resolve(),
                onError: (err) => reject("Something went Wrong"),
              })
            );
          }}
        />
      </UploadContainer>
    </Container>
  );
};

export default UploadJSONModal;
