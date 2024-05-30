import React, { useEffect, useState } from "react";
import { BsBellFill } from "react-icons/bs";
import styled, { keyframes } from "styled-components";
import TooltipWrapper from "../TooltipWrapper";

const ringAnim = keyframes`
  0% {
    transform: rotateZ(0deg);
  }
  25% {
    transform: rotateZ(-15deg);
  }
  75% {
    transform: rotateZ(15deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
`;

const Container = styled.div`
  position: relative;
`;

const Badge = styled.div`
  width: fit-content;
  padding: 0px 4px;
  height: 15px;
  bottom: calc(100% - 5px);
  left: calc(100% - 2px);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.badgeTextColor};
  background-color: ${({ theme }) => theme.brand};
  border-radius: 5px;
  font-size: 10px;
  line-height: 1.3;
`;

const Btn = styled.button`
  all: unset;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transform-origin: top;
  animation: ${ringAnim} 0.2s linear 2;
  animation: ${({ anim }) => (anim ? "none" : "")};
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
const NotificationBtn = ({ count, isActive = false, ...props }) => {
  const [anim, setAnim] = useState(false);
  useEffect(() => {
    if (anim) {
      setAnim(false);
    }
  }, [anim]);
  return (
    <TooltipWrapper tooltip="Notifications" position="top-right">
      <Container>
        {count > 0 && <Badge>{count}</Badge>}
        <Btn
          count={count}
          {...props}
          isActive={isActive}
          anim={anim}
          onClick={(ev) => {
            setAnim(true);
            if (props.onClick) {
              props.onClick(ev);
            }
          }}
        >
          <BsBellFill size={18} />
        </Btn>
      </Container>
    </TooltipWrapper>
  );
};

export default NotificationBtn;
