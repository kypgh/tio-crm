import Link from "next/link";

import { DateTime } from "luxon";
import { useRouter } from "next/router";
import filterOptions from "../../config/filtersOptions";
import { getGatewaysForBrand } from "../../config/paymentGateways";
import availableFields from "../../config/tablesAvailableFields";
import agent from "../../utils/agent";
import { formatCurrency, getAccountIdString } from "../../utils/helpers";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import PCR from "../PCR";
import { useNotification } from "../actionNotification/NotificationProvider";
import FiltersBar from "./FiltersBar";
import GridTable from "./GridTable";
import RefreshButton from "./RefreshButton";
import {
  FieldsFilter,
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
  TableExport,
} from "./TableGeneric";
import DatePicker from "../DatePicker";
import { pruneNullOrUndefinedFields } from "../../utils/functions";

function FinancesTable() {
  const notificationManager = useNotification();
  const [selectedBrand] = useSelectedBrand();
  const paymentGateways = getGatewaysForBrand(selectedBrand);

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
    ["finances"],
    (params) =>
      agent()
        .getAllTransactions(params)
        .then((res) => res.data),
    {
      queryOptions: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      availableFields: availableFields.FINANCES,
      rowFunctionality: (item) => {
        return router.push({ pathname: `/clients/${item.user._id}` });
      },
      fieldFunctionality: {
        cid: {
          format: (v, doc) => (
            <Link href={`/clients/${doc.user._id}`} passHref>
              <a style={{ textDecoration: "none", color: "inherit" }}>{v}</a>
            </Link>
          ),
        },
        loginId: {
          format: (v, doc) => {
            return getAccountIdString(doc.userAccount);
          },
        },
        processedCurrency: {
          format: (v, doc) => (v ? v : `N/A - (${doc.currency})`),
        },
        paymentMethod: {
          format: (method) =>
            paymentGateways.some((element) => element.id === method)
              ? paymentGateways.find((element) => element.id === method).title
              : method,
        },
        processedAmount: {
          format: (v, doc) =>
            doc.processed_currency
              ? formatCurrency(v, doc.processed_currency)
              : `N/A - (${formatCurrency(doc.amount, doc.currency)})`,
        },
        processedUsdAmount: {
          format: (v) => (v ? `$ ${Number(v).toFixed(2)}` : "N/A"),
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
            <FiltersBar allowedFilters={filterOptions.FINANCES} />
          </FilterInnerContainer>
          <FilterInnerContainer
            style={{
              justifyContent: "space-between",
              width: "fit-content",
            }}
          >
            <FieldsFilter
              availbleFields={availableFields.FINANCES}
              title="Finances Fields"
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
                exportFunction={agent().getAllTransactions}
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
            <Row key={row._id} onClick={row.onClick} actionable>
              {row.fields.map((field) => (
                <Cell
                  key={field.key}
                  onClick={field.onClick}
                  actionable={field.key === "user.ctrader_id"}
                >
                  {field.value}
                </Cell>
              ))}
            </Row>
          ))
        }
      </GridTable>
      <PaginationSettings data={data || {}} />
    </div>
  );
}

export default FinancesTable;
