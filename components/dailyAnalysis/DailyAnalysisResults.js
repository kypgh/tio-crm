import { useInfiniteQuery } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Loader } from "../generic";
import useOnScreen from "../../utils/hooks/useOnScreen";
import _ from "lodash";
import dailyAnalysisAgent from "../../utils/dailyAnalysisAgent";
import {
  Cell,
  Row,
  TableData,
  TableOuter,
} from "../tableComponents/TableGeneric";
import { DateTime } from "luxon";
const DailyAnalysisResultContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.primary};
  padding: 5px;
  color: ${({ theme }) => theme.textPrimary};
  overflow: hidden;
  height: 100%;
  border-radius: 0px 0px 5px 5px;

  & > * {
    width: 100%;
  }
`;

const AnalysisCursor = styled.div`
  max-height: 40px;
  background-color: black;
  opacity: 0.4;
  position: relative;
  padding: 25px;
`;

const RowContainer = styled.div``;

const StatusText = styled.p`
  background-color: ${({ theme, status }) =>
    status === "success" ? theme.success : theme.errorMsg}20;
  border: 1px solid
    ${({ theme, status }) =>
      status === "success" ? theme.success : theme.errorMsg};
  border-radius: 5px;
  padding: 5px;
`;

const AnalysisResult = ({ analysisResult, onActionBtnClick }) => {
  return (
    <Row>
      <Cell isSmall>
        <StatusText status={analysisResult.status}>
          {analysisResult.status}
        </StatusText>
      </Cell>
      <Cell>
        <p>{analysisResult.title}</p>
      </Cell>
      <Cell>
        <p>{analysisResult.link}</p>
      </Cell>
      <Cell isSmall>
        <p>{analysisResult.isUK ? ".UK" : ".COM"}</p>
      </Cell>
      <Cell isSmall>
        <p>{analysisResult.count}</p>
      </Cell>
      <Cell isMedium>
        <p>
          {DateTime.fromISO(analysisResult.updatedAt).toFormat(
            "dd/MM/yyyy - HH:mm:ss"
          )}
        </p>
      </Cell>
    </Row>
  );
};

const DailyAnalysisResults = () => {
  const [isOnScreen, ref] = useOnScreen();

  const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery(
    ["dailyAnalysis"],
    async ({ pageParam = 1 }) =>
      dailyAnalysisAgent()
        .getDailyAnalysis(pageParam)
        .then((res) => res.message),
    {
      refetchOnMount: true,
      getNextPageParam: (currPage) =>
        currPage?.hasNextPage ? currPage.page + 1 : undefined,
      getPreviousPageParam: (currPage) =>
        currPage?.hasPreviousPage ? currPage.page - 1 : undefined,
    }
  );

  // useEffect(() => {
  //   if (isOnScreen) {
  //     fetchNextPage();
  //   }
  // }, [isOnScreen]);
  return (
    <DailyAnalysisResultContainer>
      <TableOuter>
        {!isLoading ? (
          <TableData>
            <Row header>
              <Cell isSmall>Status</Cell>
              <Cell>Title</Cell>
              <Cell>Link</Cell>
              <Cell isSmall>Blog</Cell>
              <Cell isSmall>Emails Sent</Cell>
              <Cell isMedium>UpdatedAt</Cell>
            </Row>
            <RowContainer>
              {data?.pages.map(({ docs }) =>
                docs.map((analysis) => (
                  <AnalysisResult
                    key={analysis._id}
                    analysisResult={analysis}
                  />
                ))
              )}
            </RowContainer>
            {/* dont show loader if are no more pages */}
            {hasNextPage && (
              <AnalysisCursor ref={ref}>
                <Loader height={45} />
              </AnalysisCursor>
            )}
          </TableData>
        ) : (
          <Loader />
        )}
      </TableOuter>
    </DailyAnalysisResultContainer>
  );
};

export default DailyAnalysisResults;
