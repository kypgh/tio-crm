import React from "react";
import styled from "styled-components";
import { colors } from "../../config/colors";
import useTheme from "../../utils/hooks/useTheme";
import { FaCheck } from "react-icons/fa";

const Outer = styled.div`
  border-top: 2px solid ${({ theme }) => theme.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.secondary};
  padding: 10px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const ColorPalette = styled.div`
  display: flex;
  margin-right: 5px;
`;

const ColorBlock = styled.div`
  display: flex;
  width: 8px;
  height: 8px;
  border: 1px solid rgba(0, 0, 0, 0.4);
`;

const Palette = ({ theme }) => {
  const { primary, secondary, brand } = theme;
  const paletteArray = [primary, secondary, brand];
  return (
    <ColorPalette>
      {Array.from({ length: 3 }).map((_, i) => (
        <ColorBlock
          key={i}
          style={{
            backgroundColor: paletteArray[i],
          }}
        ></ColorBlock>
      ))}
    </ColorPalette>
  );
};

const SelectTheme = () => {
  const themeNames = Object.keys(colors).map((el) => ({
    label: colors[el].label,
    value: el,
  }));

  const { setTheme, theme } = useTheme();

  return (
    <Outer>
      <Header>Select Theme</Header>
      <Scrollable>
        {themeNames.map((themeName) => (
          <Item
            isSelected={themeName.value === theme.name}
            key={themeName.value}
            themeName={themeName.value}
            onClick={() => setTheme(themeName.value)}
          >
            <Palette theme={colors[themeName.value]} />
            {themeName.label}
            {themeName.value === theme.name && <FaCheck size={12} />}
          </Item>
        ))}
      </Scrollable>
    </Outer>
  );
};

export default SelectTheme;
