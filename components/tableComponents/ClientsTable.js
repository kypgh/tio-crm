import _ from "lodash";

import { useRouter } from "next/router";

import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { FcDocument } from "react-icons/fc";
import { AiOutlineClockCircle, AiOutlineCheckCircle } from "react-icons/ai";

import { colors } from "../../config/colors";
import agent from "../../utils/agent";
import {
  FilterInnerContainer,
  PaginationSettings,
  SearchQuery,
  FieldsFilter,
  FilterContainer,
  TableExport,
} from "./TableGeneric";
import PCR from "../PCR";
import FiltersBar from "./FiltersBar";
import filterOptions from "../../config/filtersOptions";
import availableFields from "../../config/tablesAvailableFields";
import GridTable from "./GridTable";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import {
  formatCurrency,
  getCountryObject,
  getDeviceIcon,
} from "../../utils/helpers";
import { useNotification } from "../actionNotification/NotificationProvider";
import RefreshButton from "./RefreshButton";
import { DateTime } from "luxon";
import DatePicker from "../DatePicker";
import { pruneNullOrUndefinedFields } from "../../utils/functions";

const ClientsTable = ({ defaultFilter }) => {
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
    ["clients", defaultFilter, router.query],
    async (params) => {
      let filters =
        [defaultFilter, router.query.filters].filter((f) => f).join(",") ||
        undefined;
      return agent()
        .getAllClients({ ...params, filters })
        .then((res) => res.data);
    },
    {
      queryOptions: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      availableFields: availableFields.CLIENTS,
      rowFunctionality: (item) => {
        router.push({ pathname: `/clients/${item._id}` });
      },
      fieldFunctionality: {
        cid: {
          format: (value) => <div>{value || "Pending"}</div>,
        },
        email: {
          format: (value, el) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {value}
              <span>
                {el.flags.hasDocuments &&
                  el.flags.kycStatus !== "missingDocuments" && <FcDocument />}
                {el.flags.kycStatus === "pending" && (
                  <AiOutlineClockCircle color={colors["dark"].pendingColor} />
                )}
                {el.flags.kycStatus === "approved" && (
                  <AiOutlineCheckCircle color={colors["dark"].success} />
                )}
              </span>
            </div>
          ),
        },
        country: {
          format: (v) => getCountryObject(v)?.name || v,
        },
        createdAt: {
          format: (v) => DateTime.fromISO(v).toFormat("dd/MM/yyyy | HH:mm"),
        },
        updatedAt: {
          format: (v) => DateTime.fromISO(v).toFormat("dd/MM/yyyy | HH:mm"),
        },
        lastLogin: {
          format: (v) => DateTime.fromISO(v).toFormat("dd/MM/yyyy | HH:mm"),
        },
        deviceType: {
          format: (v) => (
            <div style={{ textAlign: "center" }}>{getDeviceIcon(v)}</div>
          ),
        },
        kycStatus: {
          format: (v) => {
            const map = {
              pending: "Pending",
              approved: "Approved",
              rejected: "Rejected",
              missingDocuments: "Missing Documents",
            };
            return map[v];
          },
        },
        hasDocuments: {
          format: (v) => (
            <div style={{ textAlign: "center" }}>
              {v ? (
                <TiTick color={colors.dark.success} />
              ) : (
                <IoMdClose color={colors.dark.errorMsg} />
              )}
            </div>
          ),
        },
        terms: {
          format: (v) => (
            <div style={{ textAlign: "center" }}>
              {v ? (
                <TiTick color={colors.dark.success} />
              ) : (
                <IoMdClose color={colors.dark.errorMsg} />
              )}
            </div>
          ),
        },
        firstTimeDeposit: {
          format: (v) => formatCurrency(v, "USD"),
        },
        firstTimeWithdrawal: {
          format: (v) => formatCurrency(v, "USD"),
        },
        country: {
          format: (v) => getCountryObject(v)?.name.replace(/\(.*\)/g, "") || v,
        },
      },
    }
  );

  return (
    <div>
      <div>
        <FilterContainer style={{ justifyContent: "space-between" }}>
          <FilterInnerContainer style={{ alignItems: "stretch" }}>
            <SearchQuery />
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
                return router.push(
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
            <FiltersBar allowedFilters={filterOptions.CLIENTS} />
          </FilterInnerContainer>
          <FilterInnerContainer
            style={{
              justifyContent: "space-between",
              width: "fit-content",
            }}
          >
            <FieldsFilter
              availbleFields={availableFields.CLIENTS}
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
              <TableExport exportFunction={agent().getAllClients} />
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
};

export default ClientsTable;
