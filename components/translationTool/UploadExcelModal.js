import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import translationToolAgent from "../../utils/translationToolAgent";
import styled from "styled-components";
import { BtnGeneric, Loader } from "../generic";
import { FaTimes } from "react-icons/fa";
import FileUpload from "../common/FileUpload";
import { useNotification } from "../actionNotification/NotificationProvider";
import Image from "next/image";

const Container = styled.div`
  max-width: 900px;
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

const InstructionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;

const Instructions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  & span.blue {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background-color: ${({ theme }) => theme.blue};
  }
  & span.green {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background-color: ${({ theme }) => theme.success};
  }
`;

const UploadExcelModal = ({ closeModal }) => {
  const queryClient = useQueryClient();
  const sendNotif = useNotification();
  const { mutate, isLoading } = useMutation({
    mutationFn: (values) =>
      translationToolAgent().uploadTranslationExcel(values),
    onSuccess: () => {
      sendNotif.SUCCESS("Excel file uploaded successfully");
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
          <div>Upload an Excel file with translations</div>
          <span>
            This will use the english values and add translations to them
          </span>
        </Title>
        <BtnGeneric onClick={() => closeModal()}>
          <FaTimes />
        </BtnGeneric>
      </TitleRow>
      <InstructionsContainer>
        <Instructions>
          <h3>Instructions:</h3>
          <p>
            The excel file uploaded needs to have a specific structure. The
            following rules need to apply:
          </p>
          <p>
            - Only one sheet is allowed per excel file (Others will be ignored)
          </p>
          <p>
            <span className="blue"></span> - The first row needs to be the
            language codes in lowercase (e.g. &apos;en&apos; for english,
            &apos;fr&apos; for french, etc.).
          </p>
          <p>
            <span className="green"></span> - The English language
            (&apos;en&apos;) is necessary and must exist. (Any translations that
            do not have an enlgish language will be ignored)
          </p>
        </Instructions>
        <Image
          src="/assets/images/tl_instructions.png"
          width={500}
          height={200}
          style={{ flexShrink: 0 }}
        />
      </InstructionsContainer>
      <UploadContainer>
        {isLoading && <Loader />}
        <FileUpload
          single
          validFileTypes={[
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ]}
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

export default UploadExcelModal;
