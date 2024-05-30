import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import Image from "next/image";

import { IoMdCloseCircleOutline, IoMdClose } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { FaFileCsv } from "react-icons/fa";
import { VscFilePdf } from "react-icons/vsc";
import { TiRefresh } from "react-icons/ti";
import { RiDragMoveFill, RiFileExcel2Line } from "react-icons/ri";

import { colors } from "../config/colors";
import { Lottie } from "./Lottie";
import loadingAnimation from "../public/assets/animations/tioLoader.json";
import useElementSize from "../utils/hooks/useElementSize";
import { Select } from "./formComponents/FormGeneric";
import agent from "../utils/agent";
import useOnClickAway from "../utils/hooks/useOnClickAway";
import TooltipWrapper from "./TooltipWrapper";
import {
  AiOutlineCloseCircle,
  AiOutlineLeftCircle,
  AiOutlineUndo,
} from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import { useMemo } from "react";
import { set } from "nprogress";
import { createPortal } from "react-dom";
import { hexToRgb } from "../utils/functions";
import _ from "lodash";

import useTheme from "../utils/hooks/useTheme";

const ImgOuter = styled.div`
  position: relative;
  min-width: ${({ width }) => width};
  max-width: ${({ width }) => width};
  min-height: ${({ height }) => height};
  width: 100%;
  height: 100%;
`;

export const ImageOuter = ({
  src,
  width = "100px",
  height = "100px",
  onLoad = () => {},
}) => {
  if (typeof width === "number") width = width + "px";
  if (typeof height === "number") height = height + "px";

  return (
    <ImgOuter width={width} height={height}>
      <Image src={src} priority layout="fill" onLoad={onLoad} />
    </ImgOuter>
  );
};

const CusPageOuter = styled.div`
  padding: 5px 15px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
`;

export const PageOuter = ({ children }) => {
  return <CusPageOuter>{children}</CusPageOuter>;
};

const ModalOuter = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -1;
`;

const CloseModal = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;

  & svg {
    color: ${({ theme }) => theme.white};
    font-size: 30px;
    font-weight: 700;
  }
`;

export const Modal = ({ children, closeState }) => {
  return (
    <ModalOuter>
      <ModalBg onClick={() => closeState(false)} />
      {children}
      <CloseModal onClick={() => closeState(false)}>
        <IoMdCloseCircleOutline />
      </CloseModal>
    </ModalOuter>
  );
};

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgOpacity, color }) => `rgba(${color}, ${bgOpacity})`};
  backdrop-filter: blur(2px);
  z-index: 9999;
  & svg {
    & path {
      fill: ${({ theme }) => theme.brand};
    }
  }
`;

/**
 * @param {{
 *  style: React.CSSProperties,
 *  width: Number,
 *  height: Number,
 *  bgOpacity: Number,
 *  }} param0
 * @returns {React.Component}
 *
 */
export const Loader = ({
  width = 100,
  height = 100,
  bgOpacity = 0.8,
  style,
}) => {
  const { theme } = useTheme();
  return (
    <LoadingContainer
      bgOpacity={bgOpacity}
      color={hexToRgb(theme.primary)}
      style={style}
    >
      <Lottie
        animationData={loadingAnimation}
        mBottom="0"
        autoPlay={true}
        loop={true}
        width={width}
        height={height}
      />
    </LoadingContainer>
  );
};

const CusTitle = styled.h1`
  color: ${({ theme }) => theme.screenTitlePrimary};
  font-size: 40px;
  font-weight: 700;
  text-shadow: ${({ theme }) => theme.screenTitleShadow};
  -webkit-text-stroke: ${({ theme }) => theme.screenTitleStroke};
  padding: 0px 0px 20px;
  user-select: none;
`;

export const Title = ({ children }) => {
  return <CusTitle>{children}</CusTitle>;
};

const BtnBlue = styled.button`
  border: 1px solid ${({ theme }) => theme.blue};
  color: ${({ theme, active }) => (active ? theme.textPrimary : theme.blue)};
  background-color: ${({ theme, active }) =>
    active ? theme.blue : theme.secondary};
  border-radius: 5px;
  padding: 3px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s all ease;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.blue};
    color: ${({ theme }) => theme.textPrimary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * @param {{
 *  style: React.CSSProperties,
 *  onClick: Function,
 *  active: boolean,
 *  children: React.ReactNode
 * }} param0
 * @returns {React.Component}
 *
 */
export const ButtonBlue = ({
  children,
  onClick,
  active,
  style,
  theme: _theme,
  ...props
}) => {
  return (
    <BtnBlue onClick={onClick} active={active} style={style} {...props}>
      {children}
    </BtnBlue>
  );
};

const BtnRed = styled(BtnBlue)`
  border-color: ${({ theme }) => theme.errorMsg};
  color: ${({ theme, active }) =>
    active ? theme.textPrimary : theme.errorMsg};
  background-color: ${({ theme, active }) =>
    active ? theme.errorMsg : theme.secondary};
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.errorMsg};
    color: ${({ theme }) => theme.textPrimary};
  }
`;

export const ButtonRed = ({ children, onClick, active, style, ...props }) => {
  return (
    <BtnRed onClick={onClick} active={active} style={style} {...props}>
      {children}
    </BtnRed>
  );
};

const ActionBtn = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  border-radius: 6px;
  background-color: ${({ invert, theme }) =>
    invert ? theme.primary : theme.secondary};
  opacity: ${({ inactive }) => (inactive ? 0.5 : 1)};
  pointer-events: ${({ inactive }) => (inactive ? "none" : "all")};
  color: ${({ theme }) => theme.white};
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.15s linear;
  &:hover {
    background-color: rgba(129, 136, 150, 0.5);
  }
  & > :not(:last-child) {
    margin-right: 5px;
  }
`;

/**
 * @param {{
 *  style: React.CSSProperties,
 *  children: React.Component,
 *  inactive: boolean,
 *  onClick: React.MouseEventHandler<HTMLDivElement>,
 *  invert: boolean
 *  type: "button" | "submit" | "reset"
 * }} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const ActionButton = ({
  children,
  inactive,
  onClick,
  invert,
  style,
  theme: _theme,
  type,
  ...props
}) => {
  return (
    <ActionBtn
      style={style}
      inactive={inactive}
      onClick={onClick}
      invert={invert}
      type={type || "button"}
      {...props}
    >
      {children}
    </ActionBtn>
  );
};

export const CalendarButton = styled.button`
  background-color: ${(props) => props.theme.secondary};
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: 5px;
  color: ${(props) => props.theme.textPrimary};
  text-align: center;
  text-decoration: none;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  &:hover {
    background-color: ${(props) => props.theme.brand};
    cursor: pointer;
  }

  &:active {
    transform: translateY(4px);
  }
`;

const RefreshContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  & svg {
    color: ${({ theme }) => theme.white};
    font-size: 30px;
    cursor: pointer;
    transition: 0.2s all ease;
  }
  & svg:hover {
    transform: rotateZ(360deg);
  }
`;
const BtnGenericSC = styled.button`
  all: unset;
  padding: 3px 10px;
  border-radius: 5px;
  color: ${({ textColor }) => textColor};
  border: 2px solid ${({ primary }) => primary};
  background-color: ${({ secondary }) => secondary};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  cursor: ${({ isDisabled, isLoading }) =>
    isDisabled || isLoading ? "normal" : "pointer"};
  font-size: 14px;
  transition: 0.3s all ease-in-out;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  position: relative;
  & > .ldr {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: ${({ secondary }) => secondary};
  }
  &.hvr:hover {
    background-color: ${({ primary }) => primary};
    border-color: ${({ secondary }) => secondary};
  }
`;

/**
 * @param {{
 *  style: React.CSSProperties,
 *  onClick: Function,
 *  isDisabled: boolean,
 *  isLoading: boolean,
 *  children: React.ReactNode,
 *  startsWith: React.ReactNode,
 *  endsWith: React.ReactNode,
 *  variant: "normal" | "invert" | "transparent"
 * }} param0
 * @returns {React.Component}
 *
 */
export const BtnGeneric = ({
  children,
  onClick = () => {},
  startsWith,
  endsWith,
  isDisabled = false,
  isLoading = false,
  style,
  variant = "normal",
  theme: _theme,
  ...props
}) => {
  const theme = useTheme();
  let { primary, secondary, textColor } = useMemo(() => {
    if (variant === "invert")
      return {
        primary: theme.primary,
        secondary: theme.secondary,
        textColor: theme.textPrimary,
      };
    if (variant === "transparent")
      return {
        primary: "transparent",
        secondary: "transparent",
        textColor: "inherit",
      };
    return {
      primary: theme.secondary,
      secondary: theme.primary,
      textColor: theme.textPrimary,
    };
  }, [variant, theme]);
  return (
    <BtnGenericSC
      onClick={(e) => {
        if (isDisabled || isLoading) return;
        onClick(e);
      }}
      isDisabled={isDisabled}
      isLoading={isLoading}
      style={style}
      {...props}
      primary={primary}
      secondary={secondary}
      textColor={textColor}
      className={isDisabled || isLoading ? "" : "hvr"}
    >
      {isLoading && (
        <div className="ldr">
          <ClipLoader color="inherit" size="0.875rem" />
        </div>
      )}

      {startsWith}
      {children}
      {endsWith}
    </BtnGenericSC>
  );
};

export const Refresh = ({ onClick }) => {
  return (
    <RefreshContainer>
      <TiRefresh onClick={onClick} />
    </RefreshContainer>
  );
};

const CenteredTypographyCus = styled.div`
  color: white;
  text-align: center;
`;

export const CenteredTypography = ({ children }) => {
  return <CenteredTypographyCus>{children}</CenteredTypographyCus>;
};

// input type checkbox to switch button
const SwitchContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 34px;
  height: 18px;

  ${({ isDisabled }) =>
    isDisabled &&
    `
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    cursor: not-allowed;
  }
  `}

  & input {
    opacity: 0;
    /* left: 0;
    width: 100px;
    height: 20px;
    z-index: 999;
    position: absolute;
    cursor: pointer; */
  }
  & span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme, invert }) =>
      invert ? theme.secondary : theme.primary};
    transition: 0.4s;
    border-radius: 34px;
  }
  & span:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: #9a9a9a;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
  & input:checked + span {
    /* background-color: ${({ theme }) => theme.blue}; */
  }
  & input:focus + span {
    box-shadow: 0 0 1px #2196f3;
  }
  & input:checked + span:before {
    transform: translateX(16px);
    background-color: ${({ theme }) => theme.brand};
  }
`;

export const Switch = ({
  checked,
  onChange,
  id,
  invert = false,
  defaultChecked,
  disabled,
  ...rest
}) => {
  const SwitchRef = useRef();
  return (
    <SwitchContainer invert={invert} isDisabled={disabled}>
      <input
        ref={SwitchRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={id}
        defaultChecked={defaultChecked}
        disabled={disabled}
        {...rest}
      />
      <span
        onClick={() => {
          SwitchRef.current.click();
        }}
      />
    </SwitchContainer>
  );
};

const SwitchHolder = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  /* padding: 1px 20px; */
  border-radius: 10px;
  box-shadow: ${({ theme }) =>
    theme.name === "dark"
      ? "1px 1px 11px rgb(0 0 0 / 16%), 10px 10px 10px rgb(0 0 0 / 20%), inset 4px 2px 14px 0px rgb(20 23 26), inset 10px 10px 10px rgb(0 0 0 / 20%)"
      : "1px 1px 11px rgb(194 231 255 / 16%)"};
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid rgb(255 255 255 / 5%);
`;

const SwitchLabel = styled.div`
  padding: 0 20px 0 10px;
  & i {
    margin-right: 5px;
  }
  & span {
    color: ${colors["dark"].blue};
    font-weight: 700;
    font-size: 13px;
  }
`;

const SwitchToggle = styled.div`
  height: 40px;
  & input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    z-index: -2;
  }
  & input[type="checkbox"] + label {
    position: relative;
    display: inline-block;
    width: 100px;
    height: 29px;
    border-radius: 20px;
    margin: 0;
    cursor: pointer;
    box-shadow: ${({ theme }) =>
      theme.name === "dark"
        ? "inset -6px -1px 15px rgb(7 8 10), inset 10px 10px 10px rgb(0 0 0 / 25%)"
        : "-6px -1px 15px rgb(222 222 222)"};
    top: 7px;
    bottom: 0;
  }
  & input[type="checkbox"] + label::before {
    position: absolute;
    content: "OFF";
    font-size: 13px;
    text-align: center;
    line-height: 22px;
    top: 4px;
    left: 8px;
    width: 45px;
    height: 21px;
    border-radius: 20px;
    background-color: #0f1317;
    box-shadow: ${({ theme }) =>
      theme.name === "dark" &&
      "inset -6px -1px 15px rgb(7 8 10),inset 10px 10px 10px rgb(0 0 0 / 25%)"};
    -webkit-transition: 0.3s ease-in-out;
    transition: 0.3s ease-in-out;
    color: #fff;
  }
  & input[type="checkbox"]:checked + label::before {
    left: 50%;
    content: "ON";
    color: #fff;
    background-color: #44b3d4;
    box-shadow: ${({ theme }) =>
      theme.name === "dark" &&
      "-3px -3px 5px rgb(33 42 52), 3px 3px 5px #004a68"};
  }
`;
export const BetterSwitch = ({ checked, onChange, id, label }) => {
  return (
    <SwitchHolder>
      <SwitchLabel>
        <span>{label}</span>
      </SwitchLabel>
      <SwitchToggle>
        <input type="checkbox" checked={checked} onChange={onChange} id={id} />
        <label htmlFor={id}></label>
      </SwitchToggle>
    </SwitchHolder>
  );
};

const AddBtnOuter = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.blue};
  cursor: pointer;
  width: fit-content;
`;

const AddBtnCus = styled.div`
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: ${({ theme, invert }) =>
    invert ? theme.secondary : theme.primary};
  border-radius: 5px;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 15px;
    height: 2px;
    background-color: ${({ theme }) => theme.blue};
    border-radius: 5px;
  }
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 15px;
    background-color: ${({ theme }) => theme.blue};
    border-radius: 5px;
  }
`;

export const AddBtn = ({
  onClick,
  invert,
  children,
  theme: _theme,
  ...props
}) => {
  return (
    <AddBtnOuter onClick={onClick} {...props}>
      <AddBtnCus invert={invert} />
      {children}
    </AddBtnOuter>
  );
};

const DraggableDiv = styled.div`
  position: fixed;
  z-index: 9999;
  border: 1px solid ${({ theme }) => theme.blue};
  border-radius: 5px;
  box-shadow: 0 0 10px ${({ theme }) => theme.blue};
`;

const DraggableBar = styled.div`
  background-color: ${({ theme }) => theme.primary};
  width: 100%;
  padding: 5px;
  border-radius: 5px 5px 0 0;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 5px;
  align-items: center;

  & span {
    color: ${({ theme }) => theme.blue};
    font-weight: 700;
    font-size: 13px;
    text-shadow: 0 0 1px ${({ theme }) => theme.blue};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const DraggableContent = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  padding: 5px;
  border-radius: 0 0 5px 5px;
`;

const IconOuter = styled.div`
  width: fit-content;

  & svg {
    cursor: grab !important;
  }
  & svg:active {
    cursor: grabbing !important;
  }
`;

export const Draggable = ({
  children,
  title,
  closeSelf,
  reset,
  initState = { x: 0, y: 0 },
}) => {
  const [pos, setPos] = useState(initState);
  const [ref, { height, width }] = useElementSize();
  const theme = useTheme();
  const handleDrag = (e) => {
    setPos({ x: e.clientX, y: e.clientY });
    if (e.clientX <= width) setPos({ x: 0, y: pos.y });
    if (e.clientY <= 12) setPos({ x: pos.x, y: 0 });
    if (e.clientX + 12 >= e.nativeEvent.view.innerWidth)
      setPos({ x: e.nativeEvent.view.innerWidth - 12, y: pos.y });
    if (e.clientY + (height - 12) >= e.nativeEvent.view.innerHeight)
      setPos({ x: pos.x, y: e.nativeEvent.view.innerHeight - (height - 12) });
  };

  return (
    <DraggableDiv
      ref={ref}
      style={{
        left: pos.x > width ? pos.x - (width - 12) : 0,
        top: pos.y > 12 ? pos.y - 12 : 0,
      }}
    >
      <DraggableBar>
        <span style={{ cursor: "pointer" }} onClick={() => closeSelf()}>
          <AiOutlineCloseCircle color={theme.blue} size={20} />
        </span>
        <span style={{ cursor: "pointer" }} onClick={() => reset && reset()}>
          <AiOutlineLeftCircle color={theme.blue} size={20} />
        </span>
        <span>{title}</span>
        <IconOuter
          draggable
          onDragEnd={handleDrag}
          onDrag={(e) => {
            e.preventDefault();
            handleDrag(e);
          }}
        >
          <RiDragMoveFill color={theme.theme.blue} size={20} />
        </IconOuter>
      </DraggableBar>
      <DraggableContent>{children}</DraggableContent>
    </DraggableDiv>
  );
};

const ExportExcl = styled.button`
  color: #007338;
  border: 1px solid #007338;
  padding: 3px 5px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: 0.3s all ease;
  margin-left: auto;
  font-weight: 700;

  &:hover {
    background-color: #007338;
    color: ${({ theme }) => theme.white};
  }
  & svg {
    font-size: 18px;
    color: inherit !important;
  }
`;

const ExportOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  gap: 5px;
`;
export const Export = ({ url, params }) => {
  const [type, setType] = useState("csv");
  const [typeIcon, setTypeIcon] = useState(<FaFileCsv />);

  useEffect(() => {
    switch (type) {
      case "csv":
        setTypeIcon(<FaFileCsv />);
        break;
      case "excel":
        setTypeIcon(<RiFileExcel2Line />);
        break;
      case "pdf":
        setTypeIcon(<VscFilePdf />);
        break;
      default:
        setTypeIcon(<FaFileCsv />);
        break;
    }
  }, [type]);

  return (
    <ExportOuter>
      <Select
        style={{ padding: "0" }}
        defaultValue={"csv"}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="csv">CSV</option>
        <option value="excel">Excel</option>
        {/* <option value="pdf">PDF</option> */}
      </Select>
      <ExportExcl
        onClick={() => {
          agent()
            .axiosInstance.get(url, {
              params: { ...params, export: type },
              responseType: "blob",
            })
            .then((res) => {
              const filename =
                res.headers["content-disposition"]?.split("=")[1] ?? "export";
              const link = document.createElement("a");
              var file = new Blob([res.data], {
                type: res.headers["content-type"],
              });
              link.href = URL.createObjectURL(file);
              link.download = filename;
              document.body.appendChild(link);
              link.click();
              link.remove();
            });
        }}
      >
        {typeIcon}
        <span>Export</span>
      </ExportExcl>
    </ExportOuter>
  );
};

const MultiSelectContainer = styled.div`
  position: relative;
`;

const MultiSelectLabel = styled.div`
  background-color: ${({ theme }) => theme.primary};
  padding: 5px 20px 5px 10px;
  font-size: 0.8rem;
  border-radius: 5px;
  position: relative;
  cursor: default;
  width: 100%;

  & span {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 50%;
    right: 10px;
    width: 5px;
    height: 5px;
    background-color: transparent;
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    transform: rotateZ(45deg) translateX(50%);
  }
`;

const MultiSelectOptionsOuter = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.secondary};
  z-index: 100;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  cursor: default;

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

const MultiSelectItem = styled.div`
  padding: 2px 10px;
  font-size: 12px;
  transition: 0.1s all ease;
  pointer-events: ${({ inactive }) => inactive && "none"};
  color: ${({ inactive }) => inactive && "grey"};
  display: flex;
  align-items: center;
  justify-content: ${({ inactive }) => inactive && "space-between"};
  gap: 7px;
  position: ${({ inactive }) => inactive && "sticky"};
  top: 0;
  z-index: 1000;
  background-color: ${({ inactive, theme }) => inactive && theme.primary};

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }

  & span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const Dot = styled.div`
  width: 7px;
  height: 7px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 50%;
  position: relative;

  &.active::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${({ theme }) => theme.brand};
    border-radius: 50%;
    width: 5px;
    height: 5px;
  }
`;

const InnerBtns = styled.div`
  padding: 2px 5px;
  background-color: ${({ theme }) => theme.secondary};
  font-size: 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  text-transform: capitalize;
  min-width: 50px;
  cursor: pointer;
  pointer-events: all;
  transition: 0.3s all ease;

  &:hover {
    background-color: ${({ theme }) => theme.brand};
  }
`;

const MultiSelectSearch = styled.input`
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border: none;
  padding: 2px 5px;
  border-radius: 5px;
  pointer-events: all;
  color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.primary};

  &:focus {
    outline: none;
  }
`;

export const MultiSelect = ({ options, onChange, value = [] }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  const formattedOptions = options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option };
    }
    return option;
  });

  useOnClickAway(ref, () => setOpen(false));

  return (
    <MultiSelectContainer ref={ref}>
      <MultiSelectLabel onClick={() => setOpen(!open)}>
        <span>
          {options
            .filter((v) => value.includes(v.value))
            .map((v) => v.label)
            .join(", ") || "Select"}
        </span>
      </MultiSelectLabel>
      {open && (
        <MultiSelectOptionsOuter>
          <MultiSelectItem inactive>
            Select
            <span>
              <InnerBtns onClick={() => onChange(options.map((v) => v.value))}>
                Select All
              </InnerBtns>
              <InnerBtns onClick={() => onChange([])}>Clear</InnerBtns>
            </span>
          </MultiSelectItem>
          <MultiSelectItem inactive>
            <MultiSelectSearch
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </MultiSelectItem>
          {formattedOptions
            .filter(
              (x) =>
                x.value.toLowerCase().includes(search.toLowerCase()) ||
                x.label.toLowerCase().includes(search.toLowerCase())
            )
            .map((option) => (
              <MultiSelectItem
                key={option.value}
                onClick={() => {
                  let res;
                  if (value.includes(option.value)) {
                    res = value.filter((item) => item !== option.value);
                  } else {
                    res = [...value, option.value];
                  }
                  onChange(res);
                }}
              >
                <Dot
                  className={`${
                    value.includes(option.value) ? "active" : undefined
                  }`}
                />
                {option.label}
              </MultiSelectItem>
            ))}
        </MultiSelectOptionsOuter>
      )}
    </MultiSelectContainer>
  );
};

const FilterBtnSC = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${({ theme }) => theme.secondaryFaded};
  color: ${({ theme }) => theme.textPrimary};
  border-radius: 5px;
  padding: 3px 3px 3px 10px;
  white-space: nowrap;
  cursor: pointer;
`;

const DeleteFilterBtn = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  transition: 0.3s all ease;
`;

export const FilterBtn = ({
  children,
  style,
  onClick = () => {},
  onDelete = () => {},
  theme: _theme,
  ...props
}) => {
  const theme = useTheme();
  return (
    <FilterBtnSC {...props} style={style} onClick={onClick}>
      {children}
      <TooltipWrapper tooltip="Delete Filter" position={"top-right"}>
        <DeleteFilterBtn
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
        >
          <FaTimes color={theme.errorMsg} size={18} />
        </DeleteFilterBtn>
      </TooltipWrapper>
    </FilterBtnSC>
  );
};

const DropdownIn = keyframes`
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
`;

const DropdownOuter = styled.div`
  position: relative;
`;

const DropdownContainer = styled.div`
  position: absolute;
  width: fit-content;
  height: fit-content;
  z-index: 1000;
  color: ${({ theme }) => theme.textPrimary};
  transform-origin: top;
  animation: ${DropdownIn} 0.3s ease;
  font-size: 12px;
  display: block;
  visibility: visible;

  & > * {
    width: max-content;
    z-index: 1000;
  }
`;

function getPosition(element, dropdown) {
  const rect = element?.getBoundingClientRect();
  let ddHeight = dropdown.clientHeight;
  const dropdownRect = dropdown?.getBoundingClientRect();
  let x = rect.x;
  let y = rect.y + rect.height;
  if (y + ddHeight > window.innerHeight) {
    y = window.innerHeight - ddHeight;
  }
  if (y < 0) {
    y = 0;
  }
  if (x < 0) {
    x = 0;
  }
  if (x + dropdownRect.width > window.innerWidth) {
    x = window.innerWidth - dropdownRect.width;
  }
  return {
    x,
    y,
  };
}

/**
 * @param {{style: React.CSSProperties, dropdownComponent: React.Component, children: React.Component }} param0
 * @returns {React.Component}
 *
 * This is used with the table component!
 */
export const Dropdown = ({ children, dropdownComponent, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const dropdownRef = useRef();

  useOnClickAway(ref, () => setIsOpen(false), [dropdownRef]);

  return (
    <DropdownOuter ref={ref} onClick={(e) => setIsOpen(!isOpen)} style={style}>
      {children}
      {isOpen &&
        createPortal(
          <DropdownContainer
            ref={(r) => {
              if (!r) return;
              let pos = getPosition(ref.current, r);
              r.style.top = pos.y + "px";
              r.style.left = pos.x + "px";
              dropdownRef.current = r;
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {dropdownComponent}
          </DropdownContainer>,
          document.getElementById("dropdownContainer")
        )}
    </DropdownOuter>
  );
};

//create a number input component with regex to only allow numbers
const NumberInputSC = styled.div`
  width: 100%;
  background-color: ${({ theme, invert }) =>
    invert ? theme.secondary : theme.primary};
  color: ${({ theme, invert }) =>
    invert ? theme.textSecondary : theme.textPrimary};
  border: 1px solid
    ${({ theme, invert }) => (invert ? theme.primary : theme.secondary)};
  padding: 5px 10px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  align-items: center;
  justify-content: start;
  gap: 2px;
  & > div {
    position: relative;
    font-size: 14px;
    flex-shrink: 0;

    & input {
      font-size: inherit;
      width: 100%;
      color: inherit;
      border: none;
      pointer-events: all;
      background-color: transparent;
      /* border: 1px solid red; */
      &:focus {
        outline: none;
      }
      /* Chrome, Safari, Edge, Opera */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      &[type="number"] {
        -moz-appearance: textfield;
      }
    }
    & span {
      visibility: hidden;
      white-space: nowrap;
      flex-shrink: 0;
    }
  }
`;

const InputNumberDosComp = styled.div`
  width: 100%;
  /* background-color: ${({ theme, invert }) =>
    invert ? theme.secondary : theme.primary}; */
  color: ${({ theme, invert }) =>
    invert ? theme.textSecondary : theme.textPrimary};

  align-items: center;
  justify-content: start;
  gap: 2px;

  & input {
    border: none;
    outline: none;

    border-radius: 5px;
    padding: 10px;
    background-color: ${({ theme, invert }) =>
      invert ? theme.secondary : theme.primary};
    color: ${({ theme, invert }) =>
      invert ? theme.textSecondary : theme.textPrimary};
    border: none;
    outline: none;
    width: 100%;
    &:focus {
      outline: none;
    }
    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
`;

export const NumberInput = ({
  onChange = () => {},
  value,
  invert,
  prefix,
  suffix,
  onClick = () => {},
  ...props
}) => {
  const inputRef = useRef();
  const handleChange = (e) => {
    // const regex = /^[0-9\b]+$/;
    // if (e.target.value === "" || regex.test(e.target.value)) {
    onChange(e);
    // }
  };
  return (
    <NumberInputSC
      invert={invert}
      onClick={() => {
        inputRef.current.focus();
        onClick();
      }}
    >
      <span>{prefix}</span>
      <div>
        {/* <span>{value !== "" ? value : props.placeholder || "0"}</span> */}
        <input
          ref={inputRef}
          onChange={handleChange}
          value={value}
          type="number"
          {...props}
        />
      </div>
      <span className="last">{value !== "" ? suffix : ""}</span>
    </NumberInputSC>
  );
};
export const NumberInputDos = ({
  onChange = () => {},
  value,
  invert,
  prefix,
  suffix,
  disabled,
  onClick = () => {},
  ...props
}) => {
  const inputRef = useRef();
  const handleChange = (e) => {
    // const regex = /^[0-9\b]+$/;
    // if (e.target.value === "" || regex.test(e.target.value)) {
    onChange(e);
    // }
  };
  return (
    <InputNumberDosComp>
      <input
        disabled={disabled}
        ref={inputRef}
        onChange={handleChange}
        value={value}
        type="number"
        {...props}
      />
    </InputNumberDosComp>
  );
};

export const CurrencyInput = ({ onChange, value, invert, ...props }) => {
  const handleChange = (e) => {
    const res = e.target.value.split(".");
    if (res.length > 2) return;
    const [num, decimal] = res;
    const regex = /^[0-9\b]+$/;
    const condition1 = num === "" || regex.test(num);
    const regex2 = /^[0-9\b]{0,2}$/;
    const condition2 = decimal === undefined || regex2.test(decimal);
    if (condition1 && condition2) {
      onChange(e);
    }
  };

  return (
    <NumberInput
      type="number"
      invert={invert}
      onChange={handleChange}
      value={value}
      {...props}
    />
  );
};
