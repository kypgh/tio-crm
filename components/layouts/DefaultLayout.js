import React, { useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import styled from "styled-components";
import NavigationBar from "./NavigationBar";
import VisitedClientsBar from "./VisitedClientsBar";
import { useIsClient } from "usehooks-ts";
import {
  useClientDocuments,
  usePendingDeposits,
  usePendingRequests,
  usePendingWithdrawals,
} from "../../utils/hooks/serverHooks";
import { useQuery } from "@tanstack/react-query";
import { USER_REQUEST_TYPES } from "../../config/enums";
import agent from "../../utils/agent";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

const MainLayout = styled.div`
  height: 100vh;
  display: flex;
  background-color: ${({ theme }) => theme.secondary};
  *::-webkit-scrollbar {
    width: 5px;
  }
  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.primary};
  }
  *::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand};
    border-radius: 50px;
  }
`;

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  overflow: hidden;

  &[data-open="true"] {
    max-width: calc(100vw - 260px);
  }

  @media (max-width: 768px) {
    height: 100vh;
  }
`;
const Child = styled.div`
  width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  max-height: 100%;
  overflow-y: auto;
`;

const CopyrightLine = styled.div`
  width: 100%;
  padding: 15px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.brand};
  font-weight: 700;
  font-size: 12px;
  opacity: 0.6;
`;

const DefaultLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedBrand] = useSelectedBrand();

  const { data: pendingChangesDocs } = useClientDocuments(
    1,
    1000,
    "pendingChanges",
    null,
    null,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const { data: pedningDocuments } = useClientDocuments(
    1,
    1000,
    "pending",
    null,
    null,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const { data: requestData } = usePendingRequests({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: pendingWithdrawals } = usePendingWithdrawals({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: pendingDeposits } = usePendingDeposits({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const filterChangeLeverage = `request_type:${USER_REQUEST_TYPES.changeAccountLeverage}`;
  const { data: changeLeverage } = useQuery(
    [selectedBrand, "pendingRequests", filterChangeLeverage],
    () =>
      agent()
        .getPendingRequests({ filters: filterChangeLeverage })
        .then((res) => res.data)
  );

  const filterDeleteAccount = `request_type:${USER_REQUEST_TYPES.deleteAccount}`;

  const { data: deleteAccount } = useQuery(
    [selectedBrand, "pendingRequests", filterDeleteAccount],
    () =>
      agent()
        .getPendingRequests({ filters: filterDeleteAccount })
        .then((res) => res.data)
  );

  const isClient = useIsClient();

  return (
    <MainLayout as={motion.div}>
      <LayoutGroup>
        <NavigationBar
          drag
          as={motion.div}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          pendingDocsData={pedningDocuments}
          pendingChangesDocs={pendingChangesDocs}
          requestsData={requestData}
          pendingWithdrawals={pendingWithdrawals}
          pendingDeposits={pendingDeposits}
          changeLeverage={changeLeverage}
          deleteAccount={deleteAccount}
        />
        <MainContainer as={motion.div} data-open={isSidebarOpen}>
          {isClient && <VisitedClientsBar />}
          <Child as={motion.div}>{children}</Child>
          <CopyrightLine>
            {`©${new Date().getFullYear()} Flo CRM. All Rights Reserved.`}
          </CopyrightLine>
        </MainContainer>
      </LayoutGroup>
    </MainLayout>
  );
};

export default DefaultLayout;
