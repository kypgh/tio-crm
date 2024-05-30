import React from "react";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

import { Loader, Refresh, CenteredTypography } from "../generic";
import {
  Cell,
  Row,
  TableData,
  TableOuter,
} from "../tableComponents/TableGeneric";
import DemoAccountsRow from "./DemoAccountsRow";
import EmptyBoundary from "../EmptyBoundary";
import { useClientAccounts } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Container = styled.div``;

export default function DemoAccountsTab({ user }) {
  const isDeleteLoading = useIsMutating("deleteDemoAccount");
  const queryClient = useQueryClient();

  const [selectedBrand] = useSelectedBrand();

  const { data, isLoading, isFetching, error } = useClientAccounts(
    user._id,
    "demo",
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  if (error) {
    return (
      <Container>
        <Refresh
          onClick={() =>
            queryClient.invalidateQueries([
              selectedBrand,
              "clientAccounts",
              user._id,
            ])
          }
        />
        <CenteredTypography>Error fetching demo accounts</CenteredTypography>
      </Container>
    );
  }

  if (isLoading || isFetching || isDeleteLoading) return <Loader />;

  return (
    <Container>
      <Refresh
        onClick={() => {
          queryClient.invalidateQueries([
            selectedBrand,
            "clientAccounts",
            user._id,
          ]);
        }}
      />
      <EmptyBoundary
        isEmpty={!data || data.length === 0}
        message="-- No Demo Accounts --"
      >
        <TableOuter>
          <TableData>
            <Row header filterExists={false}>
              <Cell isSmall>Account ID</Cell>
              <Cell>Type</Cell>
              <Cell>Platform</Cell>
              <Cell isSmall>Leverage</Cell>
              <Cell isSmall>Currency</Cell>
              <Cell>Balance</Cell>
              <Cell>Created At</Cell>
              <Cell>Action</Cell>
            </Row>
            {data.docs?.map((account) => (
              <DemoAccountsRow
                account={account}
                key={account._id}
                userId={user._id}
              />
            ))}
          </TableData>
        </TableOuter>
      </EmptyBoundary>
    </Container>
  );
}
