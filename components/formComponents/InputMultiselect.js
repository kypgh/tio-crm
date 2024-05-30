import React, { useMemo, useState } from "react";
import { Checkbox, InputField } from "./FormGeneric";
import { countryDataCodes } from "../../config/countries";
import { ActionButton } from "../generic";
import styled from "styled-components";
import { searchScore } from "../../utils/helpers";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  height: 500px;
  max-height: 500px;
  overflow: hidden;
`;

const CountriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 450px;
  width: 100%;
  height: 500px;
  max-height: 500px;
  overflow-y: scroll;
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 5px;
  border: 1px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  cursor: pointer;

  & label {
    width: 100%;
    cursor: pointer;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 500px;
  max-height: 500px;
`;

const DisplaySelected = styled.div`
  overflow: hidden;
  padding: 5px;
  color: ${({ theme }) => theme.textSecondary};
  & > div {
    height: 100%;
    overflow-y: scroll;
  }
`;

const InputMultiSelect = ({ label, onChange, value = [] }) => {
  const [search, setSearch] = useState("");
  const filteredCountries = useMemo(() => {
    if (!search || search === "") return countryDataCodes;
    return countryDataCodes.filter((el) =>
      el.name.toLowerCase().startsWith(search)
    );
  }, [search]);
  return (
    <Container>
      <CountriesContainer>
        {filteredCountries.map((el, idx) => (
          <CheckboxContainer key={idx}>
            <Checkbox
              id={el.iso2}
              value={el.iso2.toUpperCase()}
              checked={value.includes(el.iso2.toUpperCase())}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...value, e.target.value]);
                } else {
                  onChange(value.filter((el) => el !== e.target.value));
                }
              }}
            />
            <label htmlFor={el.iso2}>{el.name}</label>
          </CheckboxContainer>
        ))}
      </CountriesContainer>
      <Right>
        <InputField
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ActionButton
          invert
          onClick={() => {
            onChange(countryDataCodes.map((el) => el.iso2.toUpperCase()));
            setSearch("");
          }}
        >
          Select All
        </ActionButton>
        <ActionButton
          invert
          onClick={() => {
            onChange([]);
            setSearch("");
          }}
        >
          Clear All
        </ActionButton>
        <DisplaySelected>
          Selected Countries: <div> {value.join(", ")}</div>
        </DisplaySelected>
      </Right>
    </Container>
  );
};

export default InputMultiSelect;
