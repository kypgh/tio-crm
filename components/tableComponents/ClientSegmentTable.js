import { useQuery } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";

import agent from "../../utils/agent";
import { parseSegmentFilters } from "../../utils/functions";
import { useClientSegments } from "../../utils/hooks/serverHooks";
import { TableOuter, Cell, Row, TableData, TableLoader } from "./TableGeneric";

const Span = styled.span`
  color: ${({ theme }) => theme.brand};
  font-weight: 700;
`;

const ClientSegmentTable = () => {
  const mappedFields = {
    kycStatus: "KYC Status",
    deviceType: "Device Type",
    liveAccounts: "Live Accounts",
    demoAccounts: "Demo Accounts",
    ftdAmount: "FTD Amount",
    createdAt: "Created At",
    country: "Country",
    userDeposits: "User Deposits",
    fromDate: "From Date",
    toDate: "To Date",
  };
  const deviceMap = {
    android: "Android",
    iOS: "iOS",
    win: "Windows",
  };
  const { data, isLoading, isFetching, isError } = useClientSegments();

  if (isLoading || isFetching) {
    return <TableLoader />;
  }
  return (
    <TableOuter>
      {/* <FilterContainer></FilterContainer> */}
      <TableData>
        <Row header>
          <Cell isLarge>Name</Cell>
          <Cell>Filters</Cell>
        </Row>
        {data.map((el, idx) => (
          <Row key={idx}>
            <Cell isLarge>{el.name}</Cell>
            <Cell style={{ justifyContent: "flex-start" }}>
              {parseSegmentFilters(el.filtersString).map((filter, idx) => (
                <React.Fragment key={idx}>
                  <strong>{mappedFields[filter.field]}</strong>
                  <Span>{filter.operator}</Span>
                  <div>
                    {filter.valueIsArray
                      ? filter.value.join(", ")
                      : deviceMap[filter.value] || filter.value}
                  </div>
                </React.Fragment>
              ))}
            </Cell>
          </Row>
        ))}
      </TableData>
    </TableOuter>
  );
};

export default ClientSegmentTable;
