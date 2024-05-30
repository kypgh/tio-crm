import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";
import { BtnGeneric, Loader } from "../generic";
import { FaTimes } from "react-icons/fa";
import FileUpload from "../common/FileUpload";
import { useNotification } from "../actionNotification/NotificationProvider";
import ibUserAgent from "../../utils/ibLeadsAgent";

const Container = styled.div`
  width: 100%;
  max-width: 500px;
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
const UploadExcelModalIbLeads = ({ closeModal }) => {
  const queryClient = useQueryClient();
  const sendNotif = useNotification();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ excelFile }) =>
      ibUserAgent.uploadIbLeadsExcel(excelFile),
    onSuccess: () => {
      sendNotif.SUCCESS("Excel file uploaded successfully");
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
          <div>Upload an Excel file with IB Lead users</div>
          <span>This will use the emails and save the users in a database</span>
        </Title>
        <BtnGeneric onClick={() => closeModal()}>
          <FaTimes />
        </BtnGeneric>
      </TitleRow>
      <UploadContainer>
        {isLoading && <Loader />}
        <FileUpload
          single
          validFileTypes={[
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ]}
          onUpload={(files) => {
            return new Promise((resolve, reject) =>
              mutate(
                { excelFile: files[0] },
                {
                  onSuccess: () => resolve(),
                  onError: (err) => reject("Something went Wrong"),
                }
              )
            );
          }}
        />
      </UploadContainer>
    </Container>
  );
};

export default UploadExcelModalIbLeads;
