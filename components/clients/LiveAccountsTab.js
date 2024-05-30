import React from "react";
import { useIsMutating, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

import agent from "../../utils/agent";
import { Loader, Refresh } from "../generic";
import {
  Cell,
  Row,
  TableData,
  TableOuter,
} from "../tableComponents/TableGeneric";
import LiveAccountsRow from "./LiveAccountsRow";
import EmptyBoundary from "../EmptyBoundary";
import { useClientAccounts } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Container = styled.div`
  overflow: hidden;
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto 1fr;
`;

export default function LiveAccountsTab({ user }) {
  const isDeleteLoading = useIsMutating("deleteLiveAccount");
  const queryClient = useQueryClient();

  const [selectedBrand] = useSelectedBrand();

  const { data, isLoading, isFetching } = useClientAccounts(user._id, "live", {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) return <Loader />;

  return (
    <Container>
      <Refresh
        onClick={() => {
          queryClient.invalidateQueries([selectedBrand, "clientAccounts"]);
        }}
      />
      <EmptyBoundary
        isEmpty={!data || data.length === 0}
        message="-- No Live Accounts --"
      >
        <TableOuter>
          <TableData>
            <Row header filterExists={false}>
              <Cell isSmall>Account ID</Cell>
              <Cell isExtraSmall>Type</Cell>
              <Cell isSmall>Platform</Cell>
              <Cell isSmall>Leverage</Cell>
              <Cell isSmall>Currency</Cell>
              <Cell>Balance</Cell>
              <Cell>Equity</Cell>
              <Cell>Credit</Cell>
              <Cell>Free Margin</Cell>
              <Cell>Volume</Cell>
              <Cell>Created At</Cell>
              <Cell isSmall>Open Trades</Cell>
              <Cell isMedium>Closed Trades</Cell>
              <Cell isExtraSmall>Action</Cell>
            </Row>
            {data.docs?.map((account) => (
              <LiveAccountsRow
                userId={user._id}
                account={account}
                key={account._id}
              />
            ))}
          </TableData>
        </TableOuter>

        {/* {(isLoading || isFetching || isDeleteLoading) && <Loader />} */}
      </EmptyBoundary>
    </Container>
  );
}
