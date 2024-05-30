import React from "react";
import { FaBatteryHalf, FaSignal, FaWifi } from "react-icons/fa";
import { HiChevronDoubleRight } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";
import { colors } from "../../config/colors";

const PhoneOuter = styled.div`
  width: 300px;
  height: 100%;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 80%,
    rgba(0, 0, 0, 0) 100%
  );
  border-radius: 10px 10px 0 0;
  padding: 8px;
  padding-bottom: 0;
`;
const BackgroundInner = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.primary};
  border-radius: 10px 10px 0 0;
  overflow: hidden;
`;

const PhoneInner = styled.div`
  width: 100%;
  height: 100%;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 10px 10px 0 0;
  overflow: hidden;
`;

const PhoneHeader = styled.div`
  display: grid;
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  color: white;
  gap: 7px;
  padding: 8px;
  background-color: #224064;
  border-radius: 10px 10px 0 0;
  & > * {
    font-size: xx-small;
  }
`;

const Ribbon = styled.div`
  display: grid;
  padding: 10px;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;
  color: white;
  background-color: ${({ color }) => color};
`;

const PreviewRibbon = ({ ribbon }) => {
  return (
    <PhoneOuter>
      <BackgroundInner>
        <PhoneInner>
          <PhoneHeader>
            <p>
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
            <FaWifi />
            <FaSignal />
            <FaBatteryHalf />
          </PhoneHeader>
          <Ribbon color={ribbon.color}>
            <p>{ribbon.title}</p>
            <HiChevronDoubleRight />
            {ribbon.closable && <IoMdClose size={20} strokeWidth={1} />}
          </Ribbon>
        </PhoneInner>
      </BackgroundInner>
    </PhoneOuter>
  );
};

export default PreviewRibbon;
