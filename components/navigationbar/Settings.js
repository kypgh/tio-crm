import React from "react";
import styled from "styled-components";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import useUser from "../../utils/hooks/useUser";
import { FaCheck } from "react-icons/fa";
import { BRANDS_MAP } from "../../config/enums";
import { Loader } from "../generic";

const Outer = styled.div`
  border-top: 2px solid ${({ theme }) => theme.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.secondary};
  padding: 10px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const Header = styled.h4`
  color: ${({ theme }) => theme.textPrimary};
`;

const Scrollable = styled.div`
  max-height: 160px;
  height: 100%;
  border-radius: 7px;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
  background-color: ${({ theme }) => theme.secondary};
`;

const Item = styled.div`
  text-transform: capitalize;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 700;
  font-size: 14px;
  width: 100%;
  transition: 0.2s all ease;
  cursor: pointer;
  padding: 3px 5px;
  border-radius: 5px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary : theme.secondary};
  /* justify-content: space-between; */
  display: flex;
  align-items: center;
  svg {
    margin-left: auto;
  }
  &:hover {
    background-color: ${({ theme }) => theme.primary};
  }
`;

const Settings = () => {
  const [selectedBrand, setSelectedBrand, isLoading] = useSelectedBrand();
  const { data } = useUser();

  return (
    <Outer>
      <Header>Select Brand</Header>
      {isLoading && <Loader />}
      <Scrollable>
        {data?.user?.brands?.map((brand) => (
          <Item
            key={brand}
            onClick={() => {
              setSelectedBrand(brand);
            }}
            isSelected={brand === selectedBrand}
          >
            {BRANDS_MAP[brand]}
            {brand === selectedBrand && <FaCheck size={12} />}
          </Item>
        ))}
      </Scrollable>
    </Outer>
  );
};

export default Settings;
