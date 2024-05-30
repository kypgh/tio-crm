import Link from "next/link";

import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { FaCheck, FaInfo, FaLock, FaTimes } from "react-icons/fa";
import styled from "styled-components";
import filterOptions from "../../config/filtersOptions";
import { getGatewayByID } from "../../config/paymentGateways";
import availableFields from "../../config/tablesAvailableFields";
import agent from "../../utils/agent";
import { pruneNullOrUndefinedFields } from "../../utils/functions";
import {
  formatCurrency,
  getAccountIdString,
  getClientIdString,
} from "../../utils/helpers";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import useTheme from "../../utils/hooks/useTheme";
import DatePicker from "../DatePicker";
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

const TransactionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 5px;
  margin-right: 5px;
`;

const transactionStatusIcons = {
  approved: (theme) => <FaCheck color={theme.success} />,
  rejected: (theme) => <FaTimes color={theme.errorMsg} />,
  authorized: (theme) => <FaLock color={theme.edit} />,
  pending: (theme) => <FaInfo color={theme.pendingColor} />,
};

function WithdrawalsTable() {
  const { theme } = useTheme();
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
    ["approved-withdrawals"],
    (params) =>
      agent()
        .getWithdrawals(params)
        .then((res) => res.data),
    {
      availableFields: availableFields.TRANSACTIONS,
      fieldFunctionality: {
        custom_user_id: {
          format: (v, doc) => {
            return <p>{getClientIdString(doc.user)}</p>;
          },
        },
        account_id: {
          format: (v, doc) => {
            return <p>{getAccountIdString(doc.userAccount)}</p>;
          },
        },
        transactionStatus: {
          format: (v) => (
            <TransactionStatus>
              {typeof transactionStatusIcons[v] === "function"
                ? transactionStatusIcons[v](theme)
                : ""}{" "}
              {v}
            </TransactionStatus>
          ),
        },
        cid: {
          format: (v, doc) => (
            <Link href={`/clients/${doc.user._id}`} passHref>
              <a style={{ textDecoration: "none", color: "inherit" }}>{v}</a>
            </Link>
          ),
        },
        processedCurrency: {
          format: (v, doc) => (v ? v : `N/A - (${doc.currency})`),
        },
        processedAmount: {
          format: (v, doc) =>
            doc.processed_currency
              ? formatCurrency(v, doc.processed_currency)
              : `N/A - (${formatCurrency(doc.amount, doc.currency)})`,
        },
        paymentMethod: {
          format: (v) => getGatewayByID(v).title ?? v,
        },
        processedUsdAmount: {
          format: (v) => formatCurrency(v, "USD"),
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
            <FiltersBar allowedFilters={filterOptions.APPROVED_WITHDRAWALS} />
          </FilterInnerContainer>
          <FilterInnerContainer
            style={{
              justifyContent: "space-between",
              width: "fit-content",
            }}
          >
            <FieldsFilter
              availbleFields={availableFields.TRANSACTIONS}
              title="Withdrawals Fields"
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
                exportFunction={agent().getWithdrawals}
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
            <Row key={row._id} onClick={row.onClick}>
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
  );
}

export default WithdrawalsTable;
