import React, { useState } from "react";
import styled from "styled-components";
import _ from "lodash";

import { mappedOperators } from "../../config/filtersOptions";
import {
  DatePicker,
  FormTitle,
  InputField,
  Select,
} from "../formComponents/FormGeneric";
import { MultiSelect, ActionButton } from "../generic";

const Outer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  min-height: 150px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 3px;
  padding: 10px;
  position: relative;
  max-width: 700px;
  color: ${({ theme }) => theme.white};
  justify-content: center;
  & > * {
    width: calc(50% - 5px);
  }
`;

const FilterModal = ({
  onAddFilter = () => {},
  onSaveFilter = () => {},
  closeModal,
  modalData = { operator: "", type: "", value: [] },
  allowedFilters,
}) => {
  const [filter, setFilter] = useState(modalData);
  const filterOptions = allowedFilters.find((x) => x.type === filter.type);
  const allowedValues = (filterOptions?.values || []).map((x) =>
    !_.isObject(x) ? { value: x, label: x } : x
  );

  const isNew = !modalData.type;
  const unSaved = !_.isEqual(modalData, filter);
  return (
    <Outer>
      <FormTitle style={{ width: "100%" }}>
        {isNew ? "Add New Filter" : "Edit Filter"}
      </FormTitle>
      <Select
        style={{ width: "100%" }}
        value={filter.type}
        onChange={(e) => {
          const operator = allowedFilters.find((x) => x.type === e.target.value)
            ?.operators[0];
          setFilter({ operator, type: e.target.value, value: [] });
        }}
      >
        <option value="" disabled>
          Select
        </option>
        {allowedFilters.map((el) => (
          <option key={el.type} value={el.type}>
            {el.name}
          </option>
        ))}
      </Select>
      {filterOptions && (
        <>
          <Select
            disabled={filterOptions?.operators?.length === 1}
            value={filter.operator}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, operator: e.target.value }))
            }
          >
            {filterOptions.operators.map((operator) => (
              <option key={operator} value={operator}>
                {mappedOperators[operator] || operator}
              </option>
            ))}
          </Select>
          {filterOptions.inputType === "select" && (
            <Select
              value={filter.value.length ? filter.value[0] : ""}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, value: [e.target.value] }))
              }
            >
              <option value="" disabled>
                Select
              </option>
              {allowedValues.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          )}
          {filterOptions.inputType === "number" && (
            <InputField
              value={filter.value.length ? filter.value[0] : ""}
              smallStyles
              placeholder={"0"}
              onChange={(e) => {
                const re = /^[0-9\b]+$/; //accept only numbers
                if (e.target.value === "" || re.test(e.target.value)) {
                  setFilter((prev) => ({ ...prev, value: [e.target.value] }));
                }
              }}
            />
          )}
          {filterOptions.inputType === "date" && (
            <DatePicker
              value={filter.value.length ? filter.value[0] : ""}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, value: [e.target.value] }))
              }
            />
          )}
          {filterOptions.inputType === "multiselect" && (
            <MultiSelect
              options={filterOptions.values}
              value={filter.value}
              onChange={(value) => setFilter((prev) => ({ ...prev, value }))}
            />
          )}
        </>
      )}
      {isNew ? (
        <ActionButton
          inactive={
            !unSaved ||
            filter.operator === "" ||
            filter.type === "" ||
            filter.value.length === 0
          }
          invert
          onClick={() => {
            onAddFilter(filter);
            closeModal();
          }}
        >
          Add Filter
        </ActionButton>
      ) : (
        <ActionButton
          invert
          onClick={() => {
            onSaveFilter(filter, modalData);
            closeModal();
          }}
          inactive={!unSaved}
        >
          Save
        </ActionButton>
      )}
    </Outer>
  );
};

export default FilterModal;
