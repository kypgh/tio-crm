import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Label, Details } from "./formComponents/FormGeneric";
import SearchUserInputAutocomplete from "./smartComponents/SearchUserInputAutocomplete";
import { useClientDetailsByID } from "../utils/hooks/serverHooks";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
`;

const ClientIDContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  & > input {
    max-width: 200px;
  }
`;

const CusLabel = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 700;
`;

const ClientDetailsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  max-width: 100%;

  & > * {
    max-width: calc(33% - 5px);
    width: 100%;
  }
`;

const DetailsOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const isNumberRegex = /^\d+$/;
const ClientDetails = ({ theme, value, onSelect }) => {
  const [clientID, setClientID] = useState("");
  const [searchUser, setSearchUser] = useState(false);
  useEffect(() => {
    if (value === "") {
      setClientID("");
    }
  }, [value]);
  const { data, isFetching } = useClientDetailsByID(clientID, {
    enabled: !!searchUser,
    onSuccess: (res) => {
      onSelect(res?.user);
    },
    onError: (err) => {
      setHasError(true);
      setErrorMsg(err?.response?.data?.message);
    },
  });

  return (
    <Outer>
      <ClientIDContainer>
        <SearchUserInputAutocomplete
          theme={theme}
          value={clientID}
          onChange={(e) => {
            setSearchUser(false);
            setClientID(e.target.value);
          }}
          onSelectSuggestion={(value) => {
            setClientID(value);
            setSearchUser(true);
          }}
        />
      </ClientIDContainer>
      <ClientDetailsContainer>
        <DetailsOuter>
          <Label theme={theme}>First Name:</Label>
          <Details theme={theme} isLoading={isFetching}>
            {data?.user?.first_name}
          </Details>
        </DetailsOuter>
        <DetailsOuter>
          <Label theme={theme}>Last Name:</Label>
          <Details theme={theme} isLoading={isFetching}>
            {data?.user?.last_name}
          </Details>
        </DetailsOuter>
        <DetailsOuter>
          <Label theme={theme}>Email:</Label>
          <Details theme={theme} isLoading={isFetching}>
            {data?.user?.email}
          </Details>
        </DetailsOuter>
        <DetailsOuter>
          <Label theme={theme}>Country:</Label>
          <Details theme={theme} isLoading={isFetching}>
            {data?.user?.country}
          </Details>
        </DetailsOuter>
        <DetailsOuter>
          <Label theme={theme}>Phone:</Label>
          <Details theme={theme} isLoading={isFetching}>
            {data?.user?.phone}
          </Details>
        </DetailsOuter>
        <DetailsOuter>
          <Label theme={theme}>KYC Approved:</Label>
          <Details theme={theme} isLoading={isFetching}>
            {data && (data?.user?.flags?.kycApproved ? "Yes" : "No")}
          </Details>
        </DetailsOuter>
      </ClientDetailsContainer>
    </Outer>
  );
};

export default ClientDetails;
