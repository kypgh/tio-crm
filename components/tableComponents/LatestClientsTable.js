import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import styled, { useTheme } from "styled-components";

import agent from "../../utils/agent";
import { Refresh } from "../generic";
import {
  Cell,
  FilterContainer,
  FilterInnerContainer,
  Row,
  TableData,
  TableLoader,
  TableOuter,
} from "./TableGeneric";
import Link from "next/link";
import { getCountryObject, getDeviceIcon } from "../../utils/helpers";

import TooltipWrapper from "../TooltipWrapper";
import { FaQuestion } from "react-icons/fa";
import { useLatestClients } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import { DateTime } from "luxon";

const MiniTitle = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableKeyDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  gap: 4px;
  & > p {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
const LatestRegistrationsTable = ({ miniTitle = "" }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useLatestClients(1, 10);
  const [selectedBrand] = useSelectedBrand();

  if (isLoading || isFetching) {
    return <TableLoader />;
  }
  return (
    <TableOuter>
      <FilterContainer style={{ justifyContent: "space-between" }}>
        <FilterInnerContainer>
          <MiniTitle>{miniTitle}</MiniTitle>
          <TooltipWrapper
            tooltip={
              <TableKeyDescription>
                <p>{getDeviceIcon("iOS")} iOS (iphone - ipad etc)</p>
                <p>{getDeviceIcon("android")} Android</p>
                <p>{getDeviceIcon("windows")} Windows</p>
              </TableKeyDescription>
            }
          >
            <FaQuestion color={theme.textSecondary} size={14} />
          </TooltipWrapper>
        </FilterInnerContainer>
        <Refresh
          onClick={() =>
            queryClient.invalidateQueries([selectedBrand, "latestClients"])
          }
        />
      </FilterContainer>
      <TableData>
        <Row header>
          <Cell isSmall>Client ID</Cell>
          <Cell>First Name</Cell>
          <Cell>Last Name</Cell>
          <Cell>Country</Cell>
          <Cell isSmall center>
            Device
          </Cell>
          <Cell>Created At</Cell>
        </Row>
        {data?.docs.map((el) => (
          <Link key={el._id} href={{ pathname: `clients/${el._id}` }} passHref>
            <a style={{ textDecoration: "none" }}>
              <Row actionable>
                <Cell isSmall>{el.readableId}</Cell>
                <Cell>{el.first_name}</Cell>
                <Cell>{el.last_name}</Cell>
                <Cell>
                  {getCountryObject(el.country)?.name.replace(/\(.*\)/g, "") ||
                    el.country}
                </Cell>
                <Cell isSmall center>
                  {getDeviceIcon(el.metadata?.deviceType)}
                </Cell>
                <Cell>
                  {DateTime.fromISO(el.createdAt).toFormat(
                    "dd/MM/yyyy | HH:mm"
                  )}
                </Cell>
              </Row>
            </a>
          </Link>
        ))}
      </TableData>
    </TableOuter>
  );
};

export default LatestRegistrationsTable;
