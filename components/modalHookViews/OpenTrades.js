import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  TableData,
  Cell,
  Row,
  TableLoader,
  TableOuter,
  NoParamsPaginationSettings,
} from "../tableComponents/TableGeneric";
import { FormTitle } from "../formComponents/FormGeneric";

import { CenteredTypography, Refresh } from "../generic";
import EmptyBoundary from "../EmptyBoundary";
import { useAccountOpenTrades } from "../../utils/hooks/serverHooks";
import useWebsocket from "../../utils/hooks/useWebsocket";
import { NEXT_PUBLIC_PRICE_FEED_WS } from "../../config/enums";
import { formatCurrency } from "../../utils/helpers";
import { DateTime } from "luxon";

const Outer = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  max-width: calc(100% - 300px);
  width: 100%;
  padding: 15px;
  border-radius: 5px;
`;

const PLtext = styled.span`
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.success : theme.errorMsg};
`;

function getDataRequestString(_symbols, accountCurrency, accountGroup) {
  let symbols = [...new Set(_symbols)];
  return `symbols:${[...symbols].join(",")}:${accountGroup}:${accountCurrency}`;
}

function calculateProfit({ openPrice, closePrice, volume, exchangeRate }) {
  return (closePrice - openPrice) * volume * exchangeRate;
}

const OpenTrades = ({ account }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [priceFeed, setPriceFeed] = useState([]);

  const { sendData = {} } = useWebsocket(NEXT_PUBLIC_PRICE_FEED_WS, {
    onMessage: (ws, message) => {
      if (!message.data) return;
      try {
        setPriceFeed(JSON.parse(message.data));
      } catch (err) {}
    },
  });
  const { data, isLoading, isFetching, refetch, isError } =
    useAccountOpenTrades(account._id, page, limit, {
      onSuccess: (res) => {
        let symbols = res?.docs?.map((v) => v.symbol) || [];
        let request = getDataRequestString(
          symbols,
          account.currency,
          account.group
        );
        sendData(request);
      },
      refetchInterval: 3000,
    });
  const formattedData = useMemo(() => {
    if (!data?.docs) return { docs: [], total: 0 };
    let total = 0,
      totalVolume = 0,
      totalUsedMargin = 0;
    const docs = data.docs.map((trade, idx) => {
      const priceData = priceFeed?.find((p) => p.name === trade.symbol);
      if (!priceData) return trade;
      let profit = 0;
      let closePrice = trade.openPrice;
      if (trade.action === "BUY") {
        closePrice = priceData.bid;
        profit = calculateProfit({
          openPrice: trade.openPrice,
          closePrice: priceData.bid,
          exchangeRate: priceData.exchangeRate ?? 1,
          volume: parseFloat(trade.volume),
        });
      } else {
        closePrice = priceData.ask;
        profit = calculateProfit({
          openPrice: priceData.ask,
          closePrice: trade.openPrice,
          exchangeRate: priceData.exchangeRate ?? 1,
          volume: parseFloat(trade.volume),
        });
      }
      total += profit;
      totalVolume += Number(trade.volumeLots ?? trade.volume);
      totalUsedMargin += Number(trade.usedMargin);
      return {
        ...trade,
        profit: profit,
        currency: priceData.selectedCurrency,
        swap: trade.swap,
        closePrice,
        volume: parseFloat(trade.volume),
      };
    });
    return {
      docs,
      total,
      totalVolume: (totalVolume ?? 0).toFixed(2),
      totalUsedMargin,
    };
  }, [data?.docs, priceFeed]);
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

  if (isLoading) return <TableLoader />;
  return (
    <Outer>
      <FormTitle>Open Trades</FormTitle>
      <TableOuter>
        <TableData>
          <Row header>
            <Cell>Position ID</Cell>
            <Cell>Symbol</Cell>
            <Cell>Direction</Cell>
            <Cell>Open Datetime</Cell>
            <Cell>Open Price</Cell>
            <Cell>Current Price</Cell>
            <Cell>P&amp;L</Cell>
            <Cell>Volume (lots)</Cell>
            <Cell>Used Margin</Cell>
          </Row>
          <EmptyBoundary isEmpty={!data.docs.length}>
            {formattedData.docs.map((trade, idx) => {
              return (
                <Row key={idx}>
                  <Cell>{trade.positionId}</Cell>
                  <Cell>{trade.symbol}</Cell>
                  <Cell>{trade.action}</Cell>
                  <Cell>
                    {DateTime.fromMillis(trade.openTime).toFormat(
                      "dd/MM/yyyy | HH:mm"
                    )}
                  </Cell>
                  <Cell>{trade.openPrice}</Cell>
                  <Cell>{trade.closePrice}</Cell>
                  <Cell>
                    <PLtext isProfit={trade.profit >= 0}>
                      {formatCurrency(trade.profit, trade.currency)}
                    </PLtext>
                  </Cell>
                  <Cell>{trade.volumeLots ?? trade.volume}</Cell>
                  <Cell>{trade.usedMargin}</Cell>
                </Row>
              );
            })}
            <Row>
              <Cell>{"---"}</Cell>
              <Cell>{"---"}</Cell>
              <Cell>{"---"}</Cell>
              <Cell>{"---"}</Cell>
              <Cell>{"---"}</Cell>
              <Cell>Totals:</Cell>
              <Cell>
                <PLtext isProfit={formattedData.total > 0}>
                  {formatCurrency(formattedData.total, account.currency)}
                </PLtext>
              </Cell>
              <Cell>{formattedData.totalVolume}</Cell>
              <Cell>
                {formatCurrency(
                  formattedData.totalUsedMargin,
                  account.currency,
                  false
                )}
              </Cell>
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
    </Outer>
  );
};

export default OpenTrades;
