import React from "react";
import styled, { keyframes } from "styled-components";

import Link from "next/link";
import { DateTime } from "luxon";

const Outer = styled.div`
  border-top: 2px solid ${({ theme }) => theme.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.secondary};

  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
`;

const Inner = styled.div`
  height: max-content;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

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

const Notifimation = keyframes`
0% {
  transform: translateX(-100%);   
  opacity: 0;
}
100% {
  transform: translateX(0);
  opacity: 1;
}
`;
const Header = styled.h4`
  padding: 10px;
  color: ${({ theme }) => theme.textPrimary};
`;

const Notification = styled.a`
  width: 100%;
  color: ${({ theme }) => theme.textSecondary};
  padding: 10px 15px;
  border-bottom: 2px solid ${({ theme }) => theme.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  cursor: pointer;
  text-decoration: none;
  transform: translateX(-100%);
  opacity: 0;
  animation: ${Notifimation} 0.5s ease-in-out forwards;
  animation-delay: ${({ delay }) => Math.min(delay, 5) * 0.1}s;

  &:last-child {
    border-bottom: none;
  }
`;

const Date = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  padding: 2px 0;

  & span {
    font-weight: bold;
    color: ${({ theme }) => theme.blue};
  }
`;

const Type = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-transform: capitalize;
  padding: 2px 0;

  & span {
    font-weight: bold;
    color: ${({ theme }) => theme.brand};
  }
`;

const Ctid = styled.div`
  width: 50%;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  padding: 2px 0;

  & span {
    font-weight: bold;
    color: ${({ theme }) => theme.blue};
  }
`;

const Status = styled.div`
  width: 50%;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  padding: 2px 0;

  & span {
    font-weight: bold;
    color: ${({ theme }) => theme.blue};
  }
`;

function Notifications({ notificationsArray }) {
  return (
    <Outer>
      <Header>Notifications</Header>
      <Inner>
        {notificationsArray &&
          notificationsArray.map((el, idx) => (
            <Link
              href={{ pathname: `/${el?.notificationType}` }}
              passHref
              key={idx}
            >
              <Notification delay={idx}>
                <Date>
                  Date:{" "}
                  <span>
                    {DateTime.fromISO(el?.createdAt).toFormat("dd/MM/yyyy")}
                  </span>{" "}
                  - Time:{" "}
                  <span>
                    {DateTime.fromISO(el?.createdAt).toFormat("HH:mm")}
                  </span>
                </Date>
                <Type>
                  {el?.notificationType === "documents" && (
                    <>
                      Type:{" "}
                      <span>{el?.document_type.replaceAll("_", " ")}</span>
                    </>
                  )}
                  {el?.notificationType === "requests" && (
                    <>
                      Type: <span>{el?.request_type}</span>
                    </>
                  )}
                  {el?.notificationType === "withdrawals" && (
                    <>
                      Type: <span>{el?.request_type.replaceAll("_", " ")}</span>
                    </>
                  )}
                </Type>
                <Ctid>
                  Client ID: <span>{el?.user.ctrader_id}</span>
                </Ctid>
                <Status>
                  Status: <span>{el?.status}</span>
                </Status>
              </Notification>
            </Link>
          ))}
      </Inner>
    </Outer>
  );
}

export default Notifications;
