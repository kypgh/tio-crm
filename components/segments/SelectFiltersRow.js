import React, { useState } from "react";
import styled, { useTheme } from "styled-components";

import { RiCloseCircleLine } from "react-icons/ri";

import { colors } from "../../config/colors";
import { DatePicker, InputField, Select } from "../formComponents/FormGeneric";
import { AddBtn, MultiSelect } from "../generic";
import { mappedOperators } from "./filters";

const AddFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;
`;
const FilterInputsContainer = styled.div`
  /* display: flex; */
  display: grid;
  grid-template-columns: 18px 1fr 1fr 1fr;
  align-items: center;
  gap: 10px;

  & > * {
    width: 100%;
  }

  & > svg {
    cursor: pointer;
    max-width: fit-content;
  }
`;

const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SelectFiltersRow = ({
  availableFilters,
  filter,
  setFilter,
  filterOptions,
  onDelete = () => {},
}) => {
  const theme = useTheme();
  function setFilterType(type) {
    const options = availableFilters.find((f) => f.type === type);
    setFilter({
      ...filter,
      type,
      name: options.name,
      operator: options.operators.length === 1 ? options.operators[0] : "",
      inputType: options.inputType,
    });
  }
  function setFilterOperator(operator) {
    setFilter({ ...filter, operator });
  }
  function setFilterValue(value) {
    setFilter({ ...filter, value });
  }
  return (
    <AddFilterContainer>
      <FilterInputsContainer>
        <RiCloseCircleLine
          color={theme.errorMsg}
          size={18}
          onClick={() => onDelete()}
        />
        <Select
          value={filter.type}
          onChange={(e) => {
            setFilterType(e.target.value);
          }}
        >
          <option value={filter.type} disabled={filter.type === ""}>
            {filter.name || "Select"}
          </option>
          {availableFilters.map((af) => (
            <option key={af.type} value={af.type}>
              {af.name}
            </option>
          ))}
        </Select>
        <Select
          disabled={filterOptions?.operators?.length === 1}
          value={filter.operator}
          onChange={(e) => setFilterOperator(e.target.value)}
        >
          <option value="" disabled>
            Select
          </option>
          {filterOptions.operators.map((operator) => (
            <option key={operator} value={operator}>
              {mappedOperators[operator] || operator}
            </option>
          ))}
        </Select>
        {filterOptions.inputType === "select" && (
          <Select
            value={filter.value}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="" disabled>
              Select
            </option>
            {filterOptions.values.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        )}
        {filterOptions.inputType === "number" && (
          <InputField
            value={filter.value}
            smallStyles
            placeholder={"0"}
            onChange={(e) => {
              const re = /^[0-9\b]+$/; //accept only numbers
              if (e.target.value === "" || re.test(e.target.value)) {
                setFilterValue(e.target.value);
              }
            }}
          />
        )}
        {filterOptions.inputType === "date" && (
          <DatePicker
            value={filter.value}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        )}
        {filterOptions.inputType === "multiselect" && (
          <MultiSelect
            options={filterOptions.values}
            value={filter.value}
            onChange={(value) => setFilterValue(value)}
          />
        )}
      </FilterInputsContainer>
    </AddFilterContainer>
  );
};

export default SelectFiltersRow;
