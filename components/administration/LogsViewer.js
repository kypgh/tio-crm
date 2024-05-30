import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { USER_LOGS_ACTION_TYPES } from "../../config/userLogTypes";
import _ from "lodash";
import { useGetLogsByType } from "../../utils/hooks/serverHooks";
import { Loader } from "../generic";

import { useInfiniteQuery } from "@tanstack/react-query";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import agent from "../../utils/agent";
import { DateTime } from "luxon";
const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.primary};
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0 0 30px 0 ${({ theme }) => theme.brand} inset;
`;

const Tab = styled.div`
  padding: 5px 10px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.brand : theme.primary};
  color: ${({ theme, isSelected }) => (isSelected ? theme.black : theme.brand)};
  border-radius: 7px;
  flex: 1;
  max-width: 150px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s all ease;
  font-weight: 600;

  &:hover {
    background-color: ${({ theme }) => theme.brand};
    color: ${({ theme }) => theme.black};
  }
`;

const LogsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: calc(100vh - 190px);
  overflow-y: auto;
  min-height: 200px;
`;

const Log = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const HeadLog = styled(Log)`
  position: sticky;
  top: 0;
`;

const typesArr = [
  USER_LOGS_ACTION_TYPES.registered,
  USER_LOGS_ACTION_TYPES.loggedIn,
];

const Template = styled.div`
  border: 1px solid ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.brand};
  padding: 5px 15px;
  width: 100%;
  font-weight: 600;
  background-color: ${({ theme }) => theme.primary};
  font-size: 14px;
`;

const Timestamp = styled(Template)`
  max-width: 180px;
`;

const User = styled(Template)`
  max-width: 300px;
`;

const Description = styled(Template)``;

const HeadTimestamp = styled(Timestamp)`
  font-size: 18px;
  font-weight: 700;
`;

const HeadUser = styled(User)`
  font-size: 18px;
  font-weight: 700;
`;

const HeadDescription = styled(Description)`
  font-size: 18px;
  font-weight: 700;
`;

const LogsViewer = () => {
  const [selectedTab, setSelectedTab] = useState(typesArr[0]);
  const limit = 50;

  const [selectedBrand] = useSelectedBrand();

  const { data, isLoading, fetchNextPage } = useInfiniteQuery(
    [selectedBrand, "logs", selectedTab, limit],
    async ({ pageParam }) =>
      agent()
        .getLogsByType(selectedTab, pageParam, limit)
        .then((res) => res.data),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.next_cursor || undefined; // Return the page number of the next page
      },
    }
  );

  return (
    <Outer>
      <TabsContainer>
        {typesArr.map((type) => (
          <Tab
            key={type}
            isSelected={selectedTab === type}
            onClick={() => {
              setSelectedTab(type);
            }}
          >
            {_.startCase(type)}
          </Tab>
        ))}
      </TabsContainer>
      <LogsContainer
        onScroll={(e) => {
          const { target } = e;
          if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            fetchNextPage();
          }
        }}
      >
        <HeadLog>
          <HeadTimestamp>Timestamp</HeadTimestamp>
          <HeadUser>User</HeadUser>
          <HeadDescription>Description</HeadDescription>
        </HeadLog>
        {isLoading ? (
          <Loader />
        ) : (
          data.pages.map((page) =>
            page.docs?.map((log, idx) => (
              <Log key={idx}>
                <Timestamp>
                  {DateTime.fromISO(log.createdAt).toFormat(
                    "dd/MM/yyyy - HH:mm"
                  )}
                </Timestamp>
                <User>{log.user?.email}</User>
                <Description>{log.description}</Description>
              </Log>
            ))
          )
        )}
      </LogsContainer>
    </Outer>
  );
};

export default LogsViewer;
