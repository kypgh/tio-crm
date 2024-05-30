import { useIsMutating } from "@tanstack/react-query";

import { DateTime } from "luxon";
import { useRouter } from "next/router";
import availableFields from "../../config/tablesAvailableFields";
import agent from "../../utils/agent";
import { pruneNullOrUndefinedFields } from "../../utils/functions";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import DatePicker from "../DatePicker";
import ModalHook from "../ModalHook";
import PCR from "../PCR";
import { useNotification } from "../actionNotification/NotificationProvider";
import RequestModal from "../requestModals/RequestModal";
import GridTable from "./GridTable";
import RefreshButton from "./RefreshButton";
import {
  FieldsFilter,
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
  TableExport,
} from "./TableGeneric";

const RequestTypesMap = {
  withdrawFromAccount: "Withdraw from Account",
  deleteAccount: "Delete Account",
  depositCryptoToAccount: "Deposit Crypto to Account",
  transferFundsBetweenAccounts: "Transfer Funds Between Accounts",
  changeAccountLeverage: "Change Account Leverage",
};
function RequestsTable({ defaultFilter }) {
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
    ["pendingRequests", defaultFilter, router.query],
    async (params) => {
      let filters =
        [defaultFilter, router.query.filters].filter((f) => f).join(",") ||
        undefined;
      return agent()
        .getPendingRequests({ ...params, filters })
        .then((res) => res.data);
    },
    {
      availableFields: availableFields.REQUESTS,
      rowFunctionality: () => {},
      fieldFunctionality: {
        requestType: {
          format: (value) => RequestTypesMap[value] || value,
        },
        createdAt: {
          format: (v) => DateTime.fromISO(v).toFormat("dd/MM/yyyy | HH:mm"),
        },
      },
    }
  );

  const updateRequestLoading = useIsMutating("updateRequest");
  return (
    <div>
      <div>
        <FilterContainer style={{ justifyContent: "space-between" }}>
          <FilterInnerContainer style={{ alignItems: "stretch" }}>
            {/* <SearchQuery  /> */}
            <DatePicker
              onChange={async ({ startDate, endDate }) => {
                if (startDate && endDate) {
                  return router.push(
                    {
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        filters: `fromDate:${startDate},toDate:${endDate}`,
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
          </FilterInnerContainer>
          <FilterInnerContainer
            style={{
              justifyContent: "space-between",
              width: "fit-content",
            }}
          >
            <FieldsFilter
              availbleFields={availableFields.REQUESTS}
              title="Requests Fields"
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
                exportFunction={agent().getPendingRequests}
              />
            </PCR.export>
          </FilterInnerContainer>
        </FilterContainer>
      </div>
      <GridTable
        isLoading={isLoading || isFetching || updateRequestLoading}
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
            >
              {({ openModal }) => (
                <Row
                  onClick={(ev) => {
                    openModal();
                    row.onClick(ev);
                  }}
                  actionable
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
}

export default RequestsTable;
