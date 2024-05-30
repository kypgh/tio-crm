import React from "react";
import _ from "lodash";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import agent from "../../utils/agent";
import { colors } from "../../config/colors";
import { BtnGeneric, Loader } from "../generic";
import LogObject from "../logs/LogObject";
import { useState } from "react";
import { FaCross, FaTimes } from "react-icons/fa";
import { VscCollapseAll } from "react-icons/vsc";
import { useUserLogs } from "../../utils/hooks/serverHooks";
import FiltersBar from "../tableComponents/FiltersBar";
import filterOptions from "../../config/filtersOptions";
import { useRouter } from "next/router";

const Outer = styled.div`
  width: 100%;
  height: 100%;
  /* min-height: calc(100vh - 50px); */
  padding: 20px 0px;
`;

const Inner = styled.div`
  position: relative;
`;

const LogsHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05rem;

  padding: 10px 20px 10px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.textSecondary};
`;

const LogsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1 1 auto;
  height: 100%;
  max-height: calc(100vh - 390px);

  overflow-y: auto;

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

function LogsHistory({ id }) {
  const { query } = useRouter();
  const { data, isLoading, isFetching } = useUserLogs(
    id,
    query?.page,
    query?.limit,
    query?.filters,
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
  const [openLogs, setOpenLogs] = useState([]);
  return (
    <Outer>
      <FiltersBar allowedFilters={filterOptions.LOGS} />
      <LogsHeader>
        ACTIVITY LOG
        <BtnGeneric variant="transparent" onClick={() => setOpenLogs([])}>
          <FaTimes />
        </BtnGeneric>
      </LogsHeader>
      <Inner>
        {data && (
          <LogsContainer>
            {Object.entries(_.groupBy(data.docs, "cDate")).map((log, idx) => (
              <LogObject
                logItemData={log}
                key={idx}
                isOpen={openLogs.includes(log[0])}
                toggleOpen={() => {
                  if (openLogs.includes(log[0])) {
                    setOpenLogs(openLogs.filter((x) => x !== log[0]));
                  } else {
                    setOpenLogs([...openLogs, log[0]]);
                  }
                }}
              />
            ))}
          </LogsContainer>
        )}
        {(isLoading || isFetching) && <Loader />}
      </Inner>
    </Outer>
  );
}

export default LogsHistory;
