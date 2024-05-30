import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import styled from "styled-components";
import { pruneNullOrUndefinedFields } from "../../utils/functions";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 600;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme, invert }) =>
    invert ? theme.primary : theme.secondary};
  color: ${({ theme }) => theme.textPrimary};
  padding-right: 5px;
  border-radius: 5px;
  gap: 5px;
  border: 1px solid transparent;

  &:focus-within {
    border: 1px solid ${({ theme }) => theme.blue};
  }

  & > svg {
    cursor: pointer;
  }
`;

const Input = styled.input`
  padding: 5px;
  border-radius: 5px;
  background: ${({ theme, invert }) =>
    invert ? theme.primary : theme.secondary};
  color: ${({ theme }) => theme.textPrimary};
  outline: none;
  border: none;
`;

export const filtersStringToObject = (filters = "") => {
  return filters?.split(",").reduce((acc, curr) => {
    const [key, value] = curr.split(":");
    return {
      ...acc,
      [key]: value,
    };
  }, {});
};

export const filtersObjectToString = (filters = {}) => {
  return Object.keys(filters)
    .map((key) => `${key}:${filters[key]}`)
    .join(",");
};

/**
 *
 * @typedef {Object} FormInputProps
 * @property { String } label
 * @property { String } filterKey
 * @property { Boolean } invert
 * @property { ({value, key}) => {} } onChange
 * @property { ({value, key}) => {} } onClear
 * @param {React.InputHTMLAttributes<HTMLInputElement> & FormInputProps} param0
 */
const InputFilters = ({
  label,
  invert = false,
  filterKey,
  onChange = () => {},
  onClear = () => {},
  ...rest
}) => {
  if (!filterKey) {
    throw new Error("filterKey is required");
  }
  const router = useRouter();
  const { filters } = router.query;
  const { [filterKey]: filterValue, ...restFilters } =
    filtersStringToObject(filters);

  const [value, setValue] = useState(filterValue || "");

  useEffect(() => {
    setValue(filterValue || "");
  }, [filterValue]);

  const onSearch = ({ value, filterKey }) => {
    const rest = pruneNullOrUndefinedFields(restFilters);
    if (!value) {
      if (_.isEmpty(rest)) {
        router.push({ query: _.omit(router.query, "filters") });
        return;
      }
      const newFiltersString = filtersObjectToString(rest);
      return router.push(
        { query: { ...router.query, filters: newFiltersString } },
        undefined,
        { shallow: true }
      );
    }
    const newFilters = { ...rest, [filterKey]: value };
    const newFiltersString = filtersObjectToString(newFilters);
    return router.push(
      { query: { ...router.query, filters: newFiltersString } },
      undefined,
      { shallow: true }
    );
  };

  const clearSearch = () => {
    const rest = pruneNullOrUndefinedFields(restFilters);
    setValue("");

    if (_.isEmpty(rest)) {
      return router.push({ query: _.omit(router.query, "filters") });
    }

    const newFiltersString = filtersObjectToString(rest);
    return router.push(
      { query: { ...router.query, filters: newFiltersString } },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Outer>
      <Label htmlFor={filterKey}>{label}</Label>
      <InputContainer invert={invert}>
        <Input
          id={filterKey}
          invert={invert}
          value={value}
          {...rest}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch({ value, filterKey });
            }
          }}
          onChange={(e) => {
            setValue(e.target.value);
            onChange({ value: e.target.value, key: filterKey });
          }}
          onInput={(e) => {
            // convert every "," to "|"
            e.target.value = e.target.value.replace(/,/g, "|");
          }}
        />
        {value ? (
          <AiOutlineClose
            onClick={() => {
              clearSearch();
              onClear({ value, key: filterKey });
            }}
          />
        ) : (
          <AiOutlineSearch />
        )}
      </InputContainer>
    </Outer>
  );
};

export default InputFilters;
