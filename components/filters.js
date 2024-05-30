import styled from "styled-components";

import { Select } from "./formComponents/FormGeneric";

const SelectOuter = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 5px;
  border: 1px solid
    ${({ theme, invert }) => (invert ? theme.primary : theme.secondary)};
  background-color: ${({ theme, invert }) =>
    invert ? theme.secondary : theme.primary};
  border-radius: 5px;
  padding: 5px;
`;

const CusLabel = styled.label`
  color: ${({ theme }) => theme.textPrimary};
`;

export const FilterSelect = ({ label, invert }) => {
  return (
    <SelectOuter invert={invert}>
      <CusLabel>{label}</CusLabel>
      <Select>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
    </SelectOuter>
  );
};
