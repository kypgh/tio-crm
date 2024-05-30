import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import useAnimation from "../utils/hooks/useAnimation";
import { createPortal } from "react-dom";

const OpenAnimation = keyframes`
    from {
        scale: 1 0;
        opacity: 0;
    }
    to {
        scale: 1 1;
        opacity: 1;
    }
`;

const CloseAnimation = keyframes`
    from {  
        scale: 1 1;
        opacity: 1;
    }
    to {
        scale: 1 0;
        opacity: 0;
    }
`;

const Tooltip = styled.div`
  position: fixed;
  z-index: 10000;
  background: ${({ theme }) => theme.primary};
  border: 2px solid ${({ theme }) => theme.secondary};
  box-shadow: ${({ theme }) => theme.primary} 0px 0px 15px;
  color: ${({ theme }) => theme.textPrimary};
  padding: 7px;
  border-radius: 10px;
  font-size: 14px;
  width: max-content;
  transition: opacity 0.3s ease;
  pointer-events: none;
  animation: ${OpenAnimation} 0.15s ease-in-out;

  &.closing {
    animation: ${CloseAnimation} 0.15s ease-in-out forwards;
  }

  ${({ position }) => {
    switch (position) {
      case "top-left":
        return `
                transform: translate(-100%, -100%) translate(10px, -10px);
                border-bottom-right-radius: 0;
            `;
      case "top-right":
        return `
                transform: translate(0, -100%) translate(-10px, -10px);
                border-bottom-left-radius: 0;
            `;
      case "bottom-left":
        return `
                transform: translate(-100%, 0) translate(0px, 10px);
                border-top-right-radius: 0;
            `;
      case "bottom-right":
        return `
                transform: translate(0, 0) translate(0px, 10px);
                border-top-left-radius: 0;
            `;
      default:
        return `
                transform: translate(-100%, -100%) translate(10px, -10px);
                border-bottom-right-radius: 0;
            `;
    }
  }}

  &:after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.secondary};
    border-style: solid;
    border-width: 2px;
    box-shadow: ${({ theme }) => theme.primary} 0px 0px 15px;
    pointer-events: none;
    z-index: -1;
    ${({ position }) => {
      switch (position) {
        case "top-left":
          return `
                    border-top: 0;
                    border-left: 0;
                    top: 100%;
                    left: 100%;
                    transform: translate(-100%, -50%) translate(-2px, 2px) rotate(45deg);
                `;
        case "top-right":
          return `
                    border-top: 0;
                    border-left: 0;
                    top: 100%;
                    left: 0;
                    transform: translate(0, -50%) translate(2px, 2px) rotate(45deg);
                `;
        case "bottom-left":
          return `
                    border-bottom: 0;
                    border-right: 0;
                    top: 0;
                    left: 100%;
                    transform: translate(-100%, -50%) translate(-2px, -2px) rotate(45deg);
                `;
        case "bottom-right":
          return `
                    border-bottom: 0;
                    border-right: 0;
                    top: 0;
                    left: 0;
                    transform: translate(0, -50%) translate(2px, -2px) rotate(45deg);
                `;
        default:
          return `
                    border-top: 0;
                    border-left: 0;
                    top: 100%;
                    left: 100%;
                    transform: translate(-100%, -50%) translate(-2px, 2px) rotate(45deg);
                `;
      }
    }}
  }
`;

const TooltipContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
`;

const TooltipWrapper = ({ children, tooltip, position }) => {
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  const [isMounted, setIsMounted] = useState(false);
  const isOpen = useAnimation(isMounted, 150);

  const handleMouseMove = (e) => {
    setXPos(e.nativeEvent.clientX);
    setYPos(e.nativeEvent.clientY);
  };

  return (
    <TooltipContainer
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => {
        setIsMounted(true);
        // handleMouseMove(e);
      }}
      isOpen={isOpen}
      onMouseLeave={() => setIsMounted(false)}
    >
      {isOpen &&
        createPortal(
          <Tooltip
            position={position}
            style={{ top: yPos, left: xPos }}
            className={`${!isMounted ? "closing" : undefined}`}
          >
            {tooltip}
          </Tooltip>,
          document.getElementById("tooltipsContainer")
        )}
      {children}
    </TooltipContainer>
  );
};

export default TooltipWrapper;
