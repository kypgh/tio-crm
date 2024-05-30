import React from "react";
import { AiFillSetting } from "react-icons/ai";
import styled from "styled-components";
import TooltipWrapper from "../TooltipWrapper";

const Btn = styled.button`
  all: unset;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transform-origin: center;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isActive }) =>
    isActive ? "rotateZ(90deg)" : "rotateZ(0deg)"};
  svg {
    color: ${({ theme, isActive }) =>
      isActive ? theme.brand : theme.textSecondary};
    transition: 0.3s all ease;
  }
  &:hover svg {
    color: ${({ theme }) => theme.brand};
  }
`;

/**
 * @typedef {Object} NotificationBtnProps
 * @property {number} count
 * @property {boolean} isActive
 * @param {React.HTMLProps<HTMLButtonElement> & NotificationBtnProps} param0
 * @returns
 */
const SettingsBtn = ({ count, isActive = false, ...props }) => {
  return (
    <TooltipWrapper tooltip="Settings" position="top-right">
      <Btn count={count} isActive={isActive} {...props}>
        <AiFillSetting size={18} />
      </Btn>
    </TooltipWrapper>
  );
};

export default SettingsBtn;
