import { useInfiniteQuery } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import { FaClock, FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { colors } from "../../config/colors";
import scheduledFunctionsAgent from "../../utils/scheduledFunctionsAgent";
import { ButtonBlue, Loader } from "../generic";
import useOnScreen from "../../utils/hooks/useOnScreen";
import _ from "lodash";
import { DateTime, Duration } from "luxon";

import {
  Cell,
  Row,
  TableData,
  TableOuter,
} from "../tableComponents/TableGeneric";
import ModalHook from "../ModalHook";
import CronTaskResultModal from "./CronTaskResultModal";

const CronTaskResultsContainer = styled.div`
  display: flex;
  margin-left: 20px;
  background-color: ${({ theme }) => theme.primary};
  padding: 5px;
  color: ${({ theme }) => theme.textPrimary};
  overflow: hidden;
  height: 100%;
  border-radius: 0px 0px 5px 5px;
  max-height: 0px;
  transition: max-height 0.5s ease-in-out;
  &.expanded {
    max-height: 500px;
  }
  & > * {
    width: 100%;
  }
`;

const ScheduleCursor = styled.div`
  max-height: 40px;
  background-color: black;
  opacity: 0.4;
  position: relative;
  padding: 25px;
`;

const RowContainer = styled.div``;
const statusColor = (status, theme) =>
  ({
    SUCCESS: theme.success,
    ERROR: theme.errorMsg,
    PENDING: theme.pendingColor,
  }[status] || theme.textPrimary);

const StatusText = styled.p`
  background-color: ${({ theme, status }) => statusColor(status, theme)}20;
  border: 1px solid ${({ theme, status }) => statusColor(status, theme)};
  border-radius: 5px;
  padding: 5px;
`;

const CronTaskResult = ({ cronTaskResult, onActionBtnClick }) => {
  return (
    <Row>
      <Cell isSmall center>
        <StatusText status={cronTaskResult.status}>
          {cronTaskResult.status}
        </StatusText>
      </Cell>
      <Cell isSmall center>
        <p>{cronTaskResult.type}</p>
      </Cell>
      <Cell isMedium>
        <p>
          {DateTime.fromISO(cronTaskResult.createdAt).toFormat(
            "dd/MM/yyyy - HH:mm:ss"
          )}
        </p>
      </Cell>
      <Cell isMedium style={{ justifyContent: "flex-start" }}>
        <FaClock />
        <p>
          {cronTaskResult.timeTaken
            ? Duration.fromMillis(cronTaskResult.timeTaken).rescale().toHuman({
                listStyle: "narrow",
                unitDisplay: "narrow",
              })
            : "N/A"}
        </p>
      </Cell>
      <Cell>
        <p>{cronTaskResult.log}</p>
      </Cell>
      <Cell isSmall center>
        {_.isEmpty(cronTaskResult.result) ? (
          <p>N/A</p>
        ) : (
          <ButtonBlue onClick={onActionBtnClick}>
            <FaSearch />
          </ButtonBlue>
        )}
      </Cell>
    </Row>
  );
};

const CronTaskResults = ({ cronTask, isExpanded }) => {
  const [isOnScreen, ref] = useOnScreen();
  const [isAnimated, setIsAnimated] = useState(false);

  const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery(
    ["cronTaskResults", cronTask.id],
    ({ pageParam = 0 }) => {
      return scheduledFunctionsAgent().getCronTaskResults(
        cronTask.id,
        pageParam || 0
      );
    },
    {
      enabled: isExpanded,
      refetchInterval: 1000 * 2,
      refetchOnMount: true,
      getNextPageParam: (lastPage) =>
        !lastPage || !lastPage.hasNext ? undefined : lastPage.page + 1,
      getPreviousPageParam: (lastPage) =>
        !lastPage || !lastPage.hasPrevious ? undefined : lastPage.page - 1,
    }
  );

  useEffect(() => {
    setIsAnimated(isExpanded);
  }, [isExpanded]);

  useEffect(() => {
    if (isOnScreen) {
      fetchNextPage();
    }
  }, [isOnScreen]);
  return (
    <CronTaskResultsContainer className={isAnimated ? "expanded" : ""}>
      <TableOuter>
        {!isLoading ? (
          <TableData>
            <Row header>
              <Cell isSmall>Status</Cell>
              <Cell isSmall>Type</Cell>
              <Cell isMedium>Time Executed</Cell>
              <Cell isMedium>Time Taken</Cell>
              <Cell>Log</Cell>
              <Cell isSmall>Actions</Cell>
            </Row>
            <ModalHook componentToShow={<CronTaskResultModal />}>
              {({ openModal }) => (
                <RowContainer>
                  {data?.pages.map(({ docs }) =>
                    docs.map((ctResult) => (
                      <CronTaskResult
                        key={ctResult.id}
                        cronTaskResult={ctResult}
                        onActionBtnClick={() => {
                          openModal(ctResult);
                        }}
                      />
                    ))
                  )}
                </RowContainer>
              )}
            </ModalHook>
            {/* dont show loader if are no more pages */}
            {hasNextPage && (
              <ScheduleCursor ref={ref}>
                <Loader height={45} />
              </ScheduleCursor>
            )}
          </TableData>
        ) : (
          <Loader />
        )}
      </TableOuter>
    </CronTaskResultsContainer>
  );
};

export default CronTaskResults;
