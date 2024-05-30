import React, { useEffect, useState } from "react";
import Head from "next/head";
import styled, { useTheme } from "styled-components";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiOutlineMail } from "react-icons/hi";
import { FaCheck, FaFile, FaRegEdit, FaTimes } from "react-icons/fa";
import EditPhoneNumber from "../../../components/clients/EditPhoneNumber";
import Calendar from "../../../components/Calendar/ClientCalendar";
import agent from "../../../utils/agent";
import {
  ButtonBlue,
  Modal,
  Loader,
  BtnGeneric,
  ButtonRed,
} from "../../../components/generic";
import ClientInfo from "../../../components/clients/ClientInfo";
import NotesTab from "../../../components/clients/NotesTab";
import FinancialNotesTab from "../../../components/clients/FinancialNotesTab";
import LiveAccountsTab from "../../../components/clients/LiveAccountsTab";
import DemoAccountsTab from "../../../components/clients/DemoAccountsTab";
import FinancesTab from "../../../components/clients/FinancesTab";
import DocumentsTab from "../../../components/clients/DocumentsTab";
import ErrorBoundary from "../../../components/ErrorBoundary";
import EditClientInfo from "../../../components/clients/EditClientInfo";
import RequestsTab from "../../../components/clients/RequestsTab";
import LogsHistory from "../../../components/clients/LogsHistory";
import PCR, { usePermissions } from "../../../components/PCR";
import { PERMISSIONS } from "../../../config/permissions";
import {
  ButtonContainer,
  Select,
} from "../../../components/formComponents/FormGeneric";
import _ from "lodash";
import {
  useClientDetailsByID,
  useIsAllowedToChangeEmail,
} from "../../../utils/hooks/serverHooks";
import useSelectedBrand from "../../../utils/hooks/useSelectedBrand";
import ModalHook from "../../../components/ModalHook";
import EditEmail from "../../../components/clients/EditEmail";
import TooltipWrapper from "../../../components/TooltipWrapper";
import SalesAgentSelect from "../../../components/smartComponents/SalesAgentSelect";
import EditUtms from "../../../components/clients/EditUtms";
import SuspendUserModal from "../../../components/clients/SuspendUserModal";

const ClientsPage = styled.div`
  padding: 10px;
  width: 100%;
  height: calc(100vh - 81px);
  overflow: hidden;
  box-sizing: border-box;
`;

const PageInner = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-areas:
    "u u"
    "l m";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr;
  box-sizing: border-box;
  gap: 15px;
  overflow: hidden;
`;

const Main = styled.div`
  grid-area: m;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
`;

const LeftSide = styled.div`
  grid-area: l;
  border: 2px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  overflow: hidden;
`;

const RightSide = styled.div`
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
`;

const Hero = styled.div`
  grid-area: u;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 8px;
  padding: 10px;
  display: grid;
  grid-template:
    "a a c" auto
    "b b c" auto;
  grid-template-columns: 1fr 1fr auto;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-start;
  flex-direction: column;
`;

const HeroTopRow = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  grid-area: a;
`;

const ClientId = styled.div`
  color: ${({ theme }) => theme.white};
  font-weight: 700;
`;

const ClientName = styled.div`
  color: ${({ theme }) => theme.textSecondary};
`;

const ClientEmail = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: stretch;
  gap: 5px;
  & span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & svg {
    color: ${({ theme }) => theme.blue};
  }
`;

const EdittingRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  grid-area: b;
`;

const EdittingRowInner = styled.div`
  /* width: 100%; */
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
`;

const EditBtn = styled.div`
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.edit};
  border-radius: 5px;
  cursor: pointer;

  & svg {
    color: ${({ theme }) => theme.blue};
  }
`;

const ClientMain = styled.div`
  padding: 10px;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
`;

const ClientMainTabContainer = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  margin-bottom: 15px;
  /* justify-content: center;
  gap: 5px; */
`;

const ClientMainTab = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  border: ${({ theme }) => `2px solid ${theme.secondary}`};
  border-bottom: none;
  padding: 5px;
  color: ${({ theme }) => theme.textPrimary};
  width: ${({ tabsLength }) => `${100 / tabsLength}%`};
  text-align: center;
  cursor: pointer;
  transition: 0.3s all ease;
  font-size: 12px;

  &:first-child {
    border-top-left-radius: 5px;
    /* border-bottom-left-radius: 5px; */
  }
  &:last-child {
    border-top-right-radius: 5px;
    /* border-bottom-right-radius: 5px; */
  }
  &:hover,
  &.selected {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.white};
  }
`;

const ClientStatus = styled.div`
  display: flex;
  align-items: baseline;
  color: ${({ theme }) => theme.textSecondary};
  text-transform: capitalize;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    background-color: ${({ theme, color }) =>
      (color === "approved" && "green") ||
      (color === "pending" && theme.edit) ||
      (color === "rejected" && theme.errorMsg) ||
      (color === "missingDocuments" && theme.edit)};
  }
`;

const ClientInternalId = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};

  & span {
    font-size: 12px;
    padding-left: 5px;
  }
`;

const ShariaEnabled = styled.div`
  font-weight: bold;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.textSecondary : theme.brand};
  background-color: ${({ theme }) => theme.secondary};
  padding: 0 5px;
  border-radius: 5px;
  font-size: 14px;
`;
const UserSuspendedFlag = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.errorMsg};
  background-color: ${({ theme }) => theme.secondary};
  padding: 0 5px;
  border-radius: 5px;
  font-size: 14px;
`;

const InnerTab = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 275px);
  /* overflow: hidden; */
`;

const LoaderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SalesAssignmentContainer = styled.div`
  grid-area: c;
  padding: 10px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
`;

const SalesIndicator = styled.p`
  background-color: ${({ theme }) => theme.primary};
  padding: 5px 10px;
  border-radius: 5px;
  color: ${({ theme }) => theme.textSecondary};
`;

const kycStatusMap = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  missingDocuments: "Waiting For Documents",
};

function allowedTabs({
  notesPerm,
  financialNotesPerm,
  userDocsPerm,
  financesPrem,
  perAccountIdPerm,
  requestsPerm,
  logsPerm,
}) {
  return [
    ...(notesPerm ? ["notes"] : []),
    ...(financialNotesPerm ? ["financialNotes"] : []),
    ...(perAccountIdPerm ? ["liveAccounts"] : []),
    ...(perAccountIdPerm ? ["demoAccounts"] : []),
    ...(financesPrem ? ["finances"] : []),
    ...(userDocsPerm ? ["documents"] : []),
    ...(requestsPerm ? ["requests"] : []),
    ...(logsPerm ? ["logs"] : []),
  ];
}

const ClientDetails = ({ id, tab = "notes" }) => {
  const router = useRouter();
  const { isAllowed: isAllowedFinancialNotes } = usePermissions([
    PERMISSIONS.FINANCIAL_NOTES.view_financial_notes.value,
  ]);
  const { isAllowed: isAllowedUserDocs } = usePermissions([
    PERMISSIONS.DOCUMENTS.view_user_documents.value,
  ]);
  const { isAllowed: isAllowedPerAccountId } = usePermissions([
    PERMISSIONS.ACCOUNTS.per_account_id.value,
  ]);
  const { isAllowed: isAllowedNotes } = usePermissions([
    PERMISSIONS.NOTES.view_notes.value,
  ]);
  const { isAllowed: isAllowedFinances } = usePermissions([
    PERMISSIONS.TRANSACTIONS.view_transactions.value,
  ]);
  const { isAllowed: isAllowedRequests } = usePermissions([
    PERMISSIONS.REQUESTS.view_requests.value,
  ]);
  const { isAllowed: isAllowedLogs } = usePermissions([
    PERMISSIONS.USERS.logs.value,
  ]);

  const tabs = allowedTabs({
    notesPerm: isAllowedNotes,
    financialNotesPerm: isAllowedFinancialNotes,
    userDocsPerm: isAllowedUserDocs,
    perAccountIdPerm: isAllowedPerAccountId,
    financesPrem: isAllowedFinances,
    requestsPerm: isAllowedRequests,
    logsPerm: isAllowedLogs,
  });

  useEffect(() => {
    if (router.pathname === "/clients/[clientId]" && tabs.length > 0) {
      router.replace(`/clients/${id}/${tabs[0]}`);
    }
  }, [tabs]);

  const { data, isLoading } = useClientDetailsByID(id, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const user = data?.user;
  const { data: isAllowedToChangeEmail } = useIsAllowedToChangeEmail(id);
  //

  if (isLoading)
    return (
      <LoaderContainer>
        <Loader bgOpacity={0.3} />
      </LoaderContainer>
    );
  return (
    <>
      <Head>
        <title>
          Flo CRM |{" "}
          {[
            user?.ctrader_id && `CT-${user?.ctrader_id}`,
            user?.mt5_id && `MT5-${user?.mt5_id}`,
            user?.mt4_id && `MT4-${user?.mt4_id}`,
          ]
            .filter((v) => !!v)
            .join(", ") ||
            `${user?.first_name} ${user?.last_name}
          `}
        </title>
      </Head>
      <ClientsPage>
        <PageInner>
          <Hero>
            <HeroTopRow>
              <ClientId>Client ID: {user?.readableId}</ClientId>
              <ClientName>
                {`${user?.first_name} ${user?.last_name}`}
              </ClientName>
              <ClientEmail>
                <span>
                  <HiOutlineMail />
                </span>
                {user?.email}
              </ClientEmail>
              <ClientStatus color={user?.flags?.kycStatus}>
                {kycStatusMap[user?.flags?.kycStatus] ?? user?.flags?.kycStatus}
              </ClientStatus>
              <ClientInternalId>
                Internal ID:
                <span>{user?._id}</span>
              </ClientInternalId>

              <ShariaEnabled $disabled={!user?.flags.shariaEnabled}>{`Sharia ${
                user?.flags.shariaEnabled ? "Enabled" : "Disabled"
              }`}</ShariaEnabled>
              {user?.isSuspended && (
                <UserSuspendedFlag $disabled={!user?.flags.shariaEnabled}>
                  This user is SUSPENDED
                </UserSuspendedFlag>
              )}
            </HeroTopRow>
            <EdittingRow>
              <EdittingRowInner>
                <PCR.updateUser>
                  <ModalHook componentToShow={<EditClientInfo client={user} />}>
                    {({ openModal }) => (
                      <ButtonBlue onClick={() => openModal()}>
                        <FaRegEdit />
                        Edit Client
                      </ButtonBlue>
                    )}
                  </ModalHook>
                </PCR.updateUser>
                <PCR.updateUser>
                  <ModalHook
                    componentToShow={<EditPhoneNumber client={user} />}
                  >
                    {({ openModal }) => (
                      <ButtonBlue onClick={() => openModal()}>
                        <FaRegEdit />
                        Edit Phone Number
                      </ButtonBlue>
                    )}
                  </ModalHook>
                </PCR.updateUser>
                <PCR.updateUser>
                  {isAllowedToChangeEmail?.allowed ? (
                    <ModalHook componentToShow={<EditEmail client={user} />}>
                      {({ openModal }) => (
                        <ButtonBlue onClick={() => openModal()}>
                          <FaRegEdit />
                          Edit Email
                        </ButtonBlue>
                      )}
                    </ModalHook>
                  ) : (
                    <TooltipWrapper tooltip={"User is unable to change email"}>
                      <ButtonBlue disabled>
                        <FaRegEdit />
                        Edit Email
                      </ButtonBlue>
                    </TooltipWrapper>
                  )}
                </PCR.updateUser>
                <PCR.updateUser>
                  <ModalHook componentToShow={<EditUtms client={user} />}>
                    {({ openModal }) => (
                      <ButtonBlue onClick={() => openModal()}>
                        <FaRegEdit />
                        Edit Utms
                      </ButtonBlue>
                    )}
                  </ModalHook>
                </PCR.updateUser>
                <PCR.suspendUser>
                  <ModalHook
                    componentToShow={<SuspendUserModal client={user} />}
                  >
                    {({ openModal }) => (
                      <ButtonRed onClick={() => openModal()}>
                        <FaRegEdit />
                        {user.isSuspended ? "Unsuspend" : "Suspend"} User
                      </ButtonRed>
                    )}
                  </ModalHook>
                </PCR.suspendUser>
              </EdittingRowInner>
            </EdittingRow>
            <SalesAssignmentContainer>
              <p>Assigned to:</p>
              <PCR.changeSalesAssignment
                fallback={
                  <SalesIndicator>
                    {!!user?.sales_agent
                      ? user.sales_agent.first_name +
                        " " +
                        user.sales_agent.last_name
                      : "Not assigned"}
                  </SalesIndicator>
                }
              >
                <SalesAgentSelect
                  user={user}
                  defaultSalesAgent={user?.sales_agent}
                />
              </PCR.changeSalesAssignment>
            </SalesAssignmentContainer>
          </Hero>
          <LeftSide>
            <ErrorBoundary
              hasError={!user}
              errorMessage={"Something went wrong fetching user details"}
            >
              <ClientInfo user={user} />
            </ErrorBoundary>
          </LeftSide>
          <Main>
            <ErrorBoundary
              hasError={!user}
              errorMessage={"Something went wrong fetching user details"}
            >
              <ClientMain>
                <ClientMainTabContainer>
                  {tabs.map((tabName, index) => (
                    <ClientMainTab
                      key={index}
                      className={tabName === tab ? "selected" : ""}
                      tabsLength={tabs.length}
                      onClick={() => router.push(`/clients/${id}/${tabName}`)}
                    >
                      {_.startCase(tabName)}
                    </ClientMainTab>
                  ))}
                </ClientMainTabContainer>
                <InnerTab>
                  <PCR.viewNotes>
                    {tab === "notes" && <NotesTab user={user} />}
                  </PCR.viewNotes>
                  <PCR.viewFinancialNotes>
                    {tab === "financialNotes" && (
                      <FinancialNotesTab user={user} />
                    )}
                  </PCR.viewFinancialNotes>
                  <PCR.getAccountPerId>
                    {tab === "liveAccounts" && <LiveAccountsTab user={user} />}
                  </PCR.getAccountPerId>
                  <PCR.getAccountPerId>
                    {tab === "demoAccounts" && <DemoAccountsTab user={user} />}
                  </PCR.getAccountPerId>
                  {tab === "finances" && <FinancesTab user={user} />}
                  <PCR.viewUserDocuments>
                    {tab === "documents" && <DocumentsTab user={user} />}
                  </PCR.viewUserDocuments>
                  {tab === "requests" && <RequestsTab user={user} />}
                  <PCR.userLogs>
                    {tab === "logs" && <LogsHistory id={id} />}
                  </PCR.userLogs>
                </InnerTab>
              </ClientMain>
            </ErrorBoundary>
          </Main>
          <PCR.viewFollowups>
            {/* <RightSide> */}
            <Calendar user={user}></Calendar>
            {/* </RightSide> */}
          </PCR.viewFollowups>
        </PageInner>
      </ClientsPage>
    </>
  );
};

export default ClientDetails;

export async function getServerSideProps(context) {
  const { clientId, tab } = context.query;
  return {
    props: {
      id: clientId,
      tab,
    },
  };
}
