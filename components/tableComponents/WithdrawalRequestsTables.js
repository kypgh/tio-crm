import { useRouter } from "next/router";
import React from "react";
import { ImAttachment } from "react-icons/im";
import styled, { useTheme } from "styled-components";
import { colors } from "../../config/colors";
import filterOptions from "../../config/filtersOptions";
import availableFields from "../../config/tablesAvailableFields";
import agent from "../../utils/agent";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import { useNotification } from "../actionNotification/NotificationProvider";
import FinancialNotesTab from "../clients/FinancialNotesTab";
import ModalHook from "../ModalHook";
import PCR from "../PCR";
import TooltipWrapper from "../TooltipWrapper";
import FiltersBar from "./FiltersBar";
import GridTable from "./GridTable";
import RefreshButton from "./RefreshButton";
import {
  Cell,
  FieldsFilter,
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
  TableExport,
} from "./TableGeneric";
import RequestModal from "../requestModals/RequestModal";
import { getAccountIdString, getClientIdString } from "../../utils/helpers";
import { DateTime } from "luxon";
import DatePicker from "../DatePicker";
import { pruneNullOrUndefinedFields } from "../../utils/functions";

const FinancialNotesTabWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.primary};
  padding: 20px;
  border-radius: 5px;
  max-width: 800px;
  width: 100%;
  position: relative;
  & > div {
    width: 100%;
  }
`;

const WithdrawalRequestActions = ({ request }) => {
  const theme = useTheme();
  return (
    <Cell
      style={{
        justifyContent: "flex-start",
        gap: "10px",
        padding: "3px 5px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ModalHook
        componentToShow={
          <FinancialNotesTabWrapper>
            <FinancialNotesTab user={request.user} />
          </FinancialNotesTabWrapper>
        }
      >
        {({ openModal }) => (
          <>
            {request.hasFinancialNotes ? (
              <TooltipWrapper tooltip={"Financial Notes"}>
                <ImAttachment
                  size={16}
                  onClick={openModal}
                  color={theme.blue}
                />
              </TooltipWrapper>
            ) : (
              "---"
            )}
          </>
        )}
      </ModalHook>
    </Cell>
  );
};

const WithdrawalRequestsTables = () => {
  const router = useRouter();
  const notificationManager = useNotification();
  const {
    data,
    isLoading,
    isFetching,
    selectedFields,
    tableRows,
    reorderFields,
    resizeFields,
    refetch,
  } = useTabledQuery(
    [
      "pending-withdrawals",
      router.query.page,
      router.query.limit,
      router.query.sort,
      router.query.filters,
      router.query.search,
    ],
    (params) =>
      agent()
        .getPendingWithdrawals(params)
        .then((res) => res.data),
    {
      availableFields: availableFields.WITHDRAW_REQUESTS,
      fieldFunctionality: {
        custom_user_id: {
          format: (v, doc) => {
            return <p>{getClientIdString(doc.user)}</p>;
          },
        },
        account_id: {
          format: (v, doc) => {
            return <p>{getAccountIdString(doc.account)}</p>;
          },
        },
        actions: {
          format: (v, doc) => <WithdrawalRequestActions request={doc} />,
        },
        createdAt: {
          format: (v) => DateTime.fromISO(v).toFormat("dd/MM/yyyy | HH:mm"),
        },
        updatedAt: {
          format: (v) => DateTime.fromISO(v).toFormat("dd/MM/yyyy | HH:mm"),
        },
      },
    }
  );

  return (
    <div>
      <div>
        <FilterContainer style={{ justifyContent: "space-between" }}>
          <FilterInnerContainer style={{ alignItems: "stretch" }}>
            {/* <SearchQuery  /> */}
            <DatePicker
              onChange={async ({ startDate, endDate }) => {
                if (startDate && endDate) {
                  const existing =
                    router.query.filters
                      ?.split(",")
                      ?.filter((f) => !f.includes("fromDate"))
                      ?.filter((f) => !f.includes("toDate")) || [];
                  let filters =
                    [`fromDate:${startDate},toDate:${endDate}`, ...existing]
                      .filter((f) => f)
                      .join(",") || undefined;
                  localStorage.setItem(`${router.pathname} - filters`, filters);
                  return router.push(
                    {
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        filters,
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                }
              }}
              onClear={() => {
                router.push(
                  {
                    pathname: router.pathname,
                    query: pruneNullOrUndefinedFields({
                      ...router.query,
                      filters: undefined,
                    }),
                  },
                  undefined,
                  { shallow: true }
                );
              }}
            />
            <FiltersBar allowedFilters={filterOptions.WITHDRAW_REQUESTS} />
          </FilterInnerContainer>
          <FilterInnerContainer
            style={{
              justifyContent: "space-between",
              width: "fit-content",
            }}
          >
            <FieldsFilter
              availbleFields={availableFields.WITHDRAW_REQUESTS}
              title="Pending Withdrawals Fields"
            />
            <RefreshButton
              onClick={() =>
                refetch().then(() => {
                  notificationManager.SUCCESS("Table Refreshed");
                })
              }
              isLoading={isLoading || isFetching}
            />
            <PCR.export>
              <TableExport
                selectedFields={selectedFields}
                exportFunction={agent().getPendingWithdrawals}
              />
            </PCR.export>
          </FilterInnerContainer>
        </FilterContainer>
      </div>
      <GridTable
        isLoading={isLoading || isFetching}
        headers={selectedFields}
        onReorder={reorderFields}
        onResize={resizeFields}
      >
        {({ Row, Cell }) =>
          tableRows.map((row) => (
            <ModalHook
              key={row._id}
              componentToShow={
                <RequestModal
                  requestType={row.doc.request_type}
                  requestId={row.doc._id}
                />
              }
              onCloseModal={() => {
                refetch();
              }}
            >
              {({ openModal }) => (
                <Row
                  actionable
                  onClick={(ev) => {
                    openModal();
                    row.onClick(ev);
                  }}
                >
                  {row.fields.map((field) => (
                    <Cell key={field.key} onClick={field.onClick}>
                      {field.value}
                    </Cell>
                  ))}
                </Row>
              )}
            </ModalHook>
          ))
        }
      </GridTable>

      <PaginationSettings data={data || {}} />
    </div>
  );
};

export default WithdrawalRequestsTables;
