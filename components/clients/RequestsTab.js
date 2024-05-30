import React from "react";
import styled from "styled-components";
import { useIsMutating, useQuery, useQueryClient } from "@tanstack/react-query";

import { TiRefresh } from "react-icons/ti";

import RequestInfo from "./RequestInfo";
import { colors } from "../../config/colors";
import agent from "../../utils/agent";
import { Loader, Refresh, CenteredTypography } from "../generic";
import EmptyBoundary from "../EmptyBoundary";
import { useClientRequests } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: scroll;
  height: 650px;
  padding: 10px;
  /* height: calc(100% - 110px); */

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

function RequestsTab({ user }) {
  const queryClient = useQueryClient();

  const [selectedBrand] = useSelectedBrand();

  const { data, isLoading, isFetching, error } = useClientRequests(
    1,
    50,
    null,
    user._id,
    null,
    null,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  if (error) {
    return (
      <Outer>
        <Refresh
          onClick={() =>
            queryClient.invalidateQueries([selectedBrand, "clientRequests"])
          }
        />
        <CenteredTypography>Something went wrong.</CenteredTypography>
      </Outer>
    );
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <Outer>
      <Refresh
        onClick={() =>
          queryClient.invalidateQueries([selectedBrand, "clientRequests"])
        }
      />
      <Inner>
        {/* {(isLoading || isFetching) && <Loader />} */}
        <EmptyBoundary isEmpty={!data || data.docs.length === 0}>
          {data?.docs &&
            data?.docs.length > 0 &&
            data?.docs.map((el, idx) => <RequestInfo request={el} key={idx} />)}
        </EmptyBoundary>
      </Inner>
    </Outer>
  );
}

export default RequestsTab;
