import React from "react";
import styled from "styled-components";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { BtnGeneric, Loader } from "../generic";
import FileUpload from "../common/FileUpload";
import { FaTimes } from "react-icons/fa";
import _ from "lodash";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

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

export default function UploadDocument({ closeModal, document, userId }) {
  const actionNotification = useNotification();
  const queryClient = useQueryClient();
  const [selectedBrand] = useSelectedBrand();

  const { mutate, isLoading } = useMutation(
    async (files) =>
      Promise.all(
        files.map(async (f) => {
          const body = new FormData();
          body.append(document, f);
          return agent()
            .uploadClientKycDocument(userId, body)
            .catch(function (error) {
              return { error };
            });
        })
      ),
    {
      onSuccess: (results) => {
        if (results.every((res) => !res.error)) {
          actionNotification.SUCCESS("Uploaded Document Successfully");
        } else if (
          results.some((res) => res?.error?.response?.data?.code === 43)
        ) {
          actionNotification.ERROR("Max number of documents reached");
        } else if (results.every((res) => res.error)) {
          actionNotification.ERROR("Failed to upload documents");
        } else {
          actionNotification.WARNING("Some documents failed to upload");
        }
        queryClient.invalidateQueries([selectedBrand, "clientDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "clientKycDocuments"]);
        queryClient.invalidateQueries([selectedBrand, "client"]);
        closeModal();
      },
    }
  );
  return (
    <Container>
      <TitleRow>
        <div />
        <Title>
          Document Upload{" "}
          <span>
            {typeof document === "string"
              ? "(" + _.startCase(document) + ")"
              : ""}
          </span>
        </Title>
        <BtnGeneric onClick={() => closeModal()}>
          <FaTimes />
        </BtnGeneric>
      </TitleRow>
      <UploadContainer>
        {isLoading && <Loader />}
        <FileUpload
          onUpload={(files) =>
            new Promise((resolve) =>
              mutate(files, { onSettled: () => resolve() })
            )
          }
        />
      </UploadContainer>
    </Container>
  );
}
