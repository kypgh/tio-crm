import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../../config/colors";
import { IoIosArrowForward } from "react-icons/io";
import AnimateHeight from "react-animate-height";

const LogContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.textSecondary};
`;

const LogDate = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 700;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) linear;
  & svg {
    transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) linear;
    transform-origin: center;
    transform: rotate(90deg);
  }
  &.collapsed {
    color: ${({ theme }) => theme.blue};
  }
  &.open svg {
    transform: rotate(180deg);
  }
`;

const LogsDropdown = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  margin: 5px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondary};
`;

const LogEntry = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px 5px;
  width: 100%;
  overflow: hidden;
  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.primary};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
`;
const LogTime = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.blue};
  display: flex;
  width: fit-content;
  font-weight: 500;
`;
const ActionBy = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.textSecondary};
  width: 100%;
`;
const LogDescription = styled.p`
  margin-top: 5px;
  width: 100%;
  display: flex;
  font-size: 12px;
  color: ${({ theme }) => theme.textPrimary};
  word-break: break-word;
`;

const LogObject = ({ logItemData, isOpen, toggleOpen }) => {
  return (
    <LogContainer>
      <LogDate
        className={isOpen ? "collapsed" : "open"}
        onClick={() => {
          toggleOpen();
        }}
      >
        {logItemData[0]} <IoIosArrowForward size={16} />
      </LogDate>

      <AnimateHeight
        duration={Math.min(logItemData[1]?.length * 100, 1000)}
        height={isOpen ? "auto" : 0}
      >
        <LogsDropdown>
          {logItemData[1].map((entry, key) => (
            <LogEntry key={key}>
              <Header>
                <LogTime>
                  {`[${new Intl.DateTimeFormat("en-GB", {
                    timeStyle: "medium",
                    timeZone: "Asia/Nicosia",
                  }).format(Date.parse(entry.createdAt))}]`}
                </LogTime>
                <ActionBy>
                  -{" "}
                  {!!entry.crmuser
                    ? `by ${entry.crmuser?.first_name} ${entry.crmuser?.last_name} (${entry.crmuser?.email})`
                    : "by user"}
                </ActionBy>
              </Header>
              <LogDescription>{entry.description}</LogDescription>
            </LogEntry>
          ))}
        </LogsDropdown>
      </AnimateHeight>
    </LogContainer>
  );
};

export default LogObject;
