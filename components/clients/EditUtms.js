import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";
import agent from "../../utils/agent";
import { useNotification } from "../actionNotification/NotificationProvider";
import {
  FormTitle,
  InputField,
  Label,
  SumbitButton,
} from "../formComponents/FormGeneric";
import { pruneNullOrUndefinedFields } from "../../utils/functions";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { Loader } from "../generic";

const Outer = styled.div`
  max-width: 700px;
  max-height: calc(100vh - 70px);
  overflow: auto;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;

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

const FullContainer = styled.div`
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const utmsArray = [
  {
    value: "utm_source",
    label: "Utm Source",
  },
  {
    value: "utm_medium",
    label: "Utm Medium",
  },
  {
    value: "utm_campaign",
    label: "Utm Campaign",
  },
  {
    value: "utm_term",
    label: "Utm Term",
  },
  {
    value: "utm_content",
    label: "Utm Content",
  },
];

const EditUtms = ({ client, closeModal }) => {
  const actionNotification = useNotification();
  const queryClient = useQueryClient();
  const [selectedBrand] = useSelectedBrand();

  const [utms, setUtms] = useState({
    utm_source: client.metadata.utm_source,
    utm_medium: client.metadata.utm_medium,
    utm_campaign: client.metadata.utm_campaign,
    utm_term: client.metadata.utm_term,
    utm_content: client.metadata.utm_content,
  });

  const updateUtms = useMutation(
    (utms) =>
      agent().updateUserUtms(client._id, pruneNullOrUndefinedFields(utms)),
    {
      onSuccess: () => {
        actionNotification.SUCCESS("Utms Updated");
        queryClient.invalidateQueries([selectedBrand, "client", client._id]);
        closeModal();
      },
      onError: (e) => {
        actionNotification.ERROR("Error updating utms");
      },
    }
  );

  return (
    <Outer>
      {updateUtms.isLoading && <Loader />}
      <FormTitle>Edit Utms</FormTitle>
      {utmsArray.map((utm) => (
        <LabeledField label={utm.label} key={utm.value}>
          <InputField
            value={utms[utm.value] || ""}
            onChange={(e) => {
              setUtms({ ...utms, [utm.value]: e.target.value });
            }}
          />
        </LabeledField>
      ))}
      <SumbitButton
        style={{
          maxWidth: "150px",
          margin: "auto",
          marginTop: "20px",
        }}
        onClick={() => updateUtms.mutate(utms)}
      >
        Update Utms
      </SumbitButton>
    </Outer>
  );
};

const LabeledField = ({ label, children }) => {
  return (
    <FullContainer>
      <Label>{label}</Label>
      {children}
    </FullContainer>
  );
};

export default EditUtms;
