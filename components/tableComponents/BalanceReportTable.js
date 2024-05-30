import React from "react";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import { useRouter } from "next/router";
import agent from "../../utils/agent";
import {
  FieldsFilter,
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
  SearchQuery,
  TableExport,
} from "./TableGeneric";
import FiltersBar from "./FiltersBar";
import RefreshButton from "./RefreshButton";
import PCR from "../PCR";
import { useNotification } from "../actionNotification/NotificationProvider";
import GridTable from "./GridTable";
import availableFields from "../../config/tablesAvailableFields";

const BalanceReportTable = () => {
  const notificationManager = useNotification();

  const router = useRouter();
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
    ["clients", router.query],
    async (params) => {
      return agent()
        .getBalanceReport(params)
        .then((res) => res.data);
    },
    {
      queryOptions: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      availableFields: availableFields.BALANCE_REPORT,
      fieldFunctionality: {
        readableId: {
          format: (value, doc) => {
            return (
              <div
                onClick={() => {
                  router.push({ pathname: `/clients/${doc._id}` });
                }}
              >
                {value}
              </div>
            );
          },
        },
      },
    }
  );

  return (
    <div>
      <div>
        <FilterContainer style={{ justifyContent: "space-between" }}>
          <FilterInnerContainer style={{ alignItems: "stretch" }}>
            {/* <FiltersBar allowedFilters={filterOptions.CLIENTS} /> */}
          </FilterInnerContainer>
          <FilterInnerContainer
            style={{
              justifyContent: "space-between",
              width: "fit-content",
            }}
          >
            <FieldsFilter
              availbleFields={availableFields.BALANCE_REPORT}
              title="Clients Fields"
            />

            <RefreshButton
              onClick={() => {
                refetch().then(() => {
                  notificationManager.SUCCESS("Table Refreshed");
                });
              }}
              isLoading={isLoading || isFetching}
            />
            <PCR.export>
              <TableExport
                selectedFields={selectedFields}
                exportFunction={agent().getBalanceReport}
              />
            </PCR.export>
          </FilterInnerContainer>
        </FilterContainer>
        <GridTable
          isLoading={isLoading || isFetching}
          headers={selectedFields}
          onReorder={reorderFields}
          onResize={resizeFields}
        >
          {({ Row, Cell }) =>
            tableRows.map((row) => (
              <Row key={row._id} onClick={row.onClick} actionable>
                {row.fields.map((field) => (
                  <Cell key={field.key} onClick={field.onClick}>
                    {field.value}
                  </Cell>
                ))}
              </Row>
            ))
          }
        </GridTable>
        <PaginationSettings data={data || {}} />
      </div>
    </div>
  );
};

export default BalanceReportTable;
