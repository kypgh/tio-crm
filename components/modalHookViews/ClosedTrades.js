import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "sheetjs-style";

import {
  CTRADER_POSITION_STATUS,
  CTRADER_SYMBOLS,
} from "../../config/ctraderEnums";
import {
  CenteredTypography,
  Refresh,
  ButtonBlue,
  Draggable,
  Switch,
  Export,
} from "../generic";
import agent from "../../utils/agent";
import {
  Cell,
  FilterContainer,
  FilterInnerContainer,
  NoParamsPaginationSettings,
  NoParamsSortLink,
  Row,
  TableData,
  TableLoader,
  TableOuter,
} from "../tableComponents/TableGeneric";
import { FormTitle } from "../formComponents/FormGeneric";
import EmptyBoundary from "../EmptyBoundary";

import { formatFilters } from "../../utils/functions";
import { useAccountClosedTrades } from "../../utils/hooks/serverHooks";
import { formatCurrency } from "../../utils/helpers";
import { DateTime } from "luxon";

const Outer = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  max-width: calc(100% - 300px);
  width: 100%;
  padding: 15px;
  border-radius: 5px;
`;

const ClosedTrades = ({ account }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sort, setSort] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const { data, isLoading, isFetching, refetch, isError } =
    useAccountClosedTrades(account._id, page, limit);
  if (isError)
    return (
      <>
        <Refresh
          onClick={() => {
            setLimit(50);
            setPage(1);
            refetch();
          }}
        />
        <CenteredTypography>Something went wrong</CenteredTypography>
      </>
    );
  return (
    <Outer>
      <FormTitle>Closed Trades</FormTitle>
      {isLoading || isFetching ? (
        <TableLoader />
      ) : (
        <TableOuter>
          <TableData>
            <Row header>
              <NoParamsSortLink
                sort={sort}
                setSort={setSort}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              >
                <Cell>Position ID</Cell>
                <Cell>Symbol</Cell>
                <Cell>Direction</Cell>
                <Cell>Open Datetime</Cell>
                <Cell>Open Price</Cell>
                <Cell>Close DateTime</Cell>
                <Cell>Close Price</Cell>
                <Cell>Swap</Cell>
                <Cell>Commission</Cell>
                <Cell>Gross Profit</Cell>
                <Cell>Net Profit</Cell>
                <Cell>Volume (lots)</Cell>
              </NoParamsSortLink>
            </Row>
            <EmptyBoundary isEmpty={!data.docs.length}>
              {data.docs.map((trade, idx) => (
                <Row key={idx}>
                  <Cell>{trade.positionId}</Cell>
                  <Cell>{trade.symbol}</Cell>
                  <Cell>{trade.action}</Cell>
                  <Cell>
                    {DateTime.fromMillis(trade.openTime).toFormat(
                      "dd/MM/yyyy | HH:mm"
                    )}
                  </Cell>
                  <Cell>
                    {Number(trade.openPrice).toFixed(trade.digitsPrice)}
                  </Cell>
                  <Cell>
                    {DateTime.fromMillis(trade.closeTime).toFormat(
                      "dd/MM/yyyy | HH:mm"
                    )}
                  </Cell>
                  <Cell>
                    {Number(trade.closePrice).toFixed(trade.digitsPrice)}
                  </Cell>
                  <Cell>
                    {Number(trade.swap).toFixed(trade.digitsCurrency)}
                  </Cell>
                  <Cell>
                    {Number(trade.commission).toFixed(trade.digitsCurrency)}
                  </Cell>
                  <Cell>
                    {Number(trade.grossProfit).toFixed(trade.digitsCurrency)}
                  </Cell>
                  <Cell>
                    {Number(trade.netProfit).toFixed(trade.digitsCurrency)}
                  </Cell>
                  <Cell>{trade.volume}</Cell>
                </Row>
              ))}
              <Row>
                <Cell>Totals for all history:</Cell>
                <Cell>{"---"}</Cell>
                <Cell>{"---"}</Cell>
                <Cell>{"---"}</Cell>
                <Cell>{"---"}</Cell>
                <Cell>{"---"}</Cell>
                <Cell>{"---"}</Cell>
                <Cell>{formatCurrency(data.totalSwap, account.currency)}</Cell>
                <Cell>
                  {formatCurrency(data.totalCommission, account.currency)}
                </Cell>
                <Cell>
                  {formatCurrency(data.totalGrossProfit, account.currency)}
                </Cell>
                <Cell>
                  {formatCurrency(data.totalNetProfit, account.currency)}
                </Cell>
                <Cell>{data.totalVolume}</Cell>
              </Row>
            </EmptyBoundary>
          </TableData>
          <NoParamsPaginationSettings
            data={data}
            limit={limit}
            setLimit={setLimit}
            setPage={setPage}
          />
        </TableOuter>
      )}
    </Outer>
  );
};

export default ClosedTrades;
