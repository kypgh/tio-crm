import availableFields from "../../config/tablesAvailableFields";
import agent from "../../utils/agent";
import { formatCurrency } from "../../utils/helpers";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import { useNotification } from "../actionNotification/NotificationProvider";
import GridTable from "./GridTable";
import RefreshButton from "./RefreshButton";
import {
  FieldsFilter,
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
} from "./TableGeneric";

import { DateTime } from "luxon";
import { getGatewaysForBrand } from "../../config/paymentGateways";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import DatePicker from "../DatePicker";
import { useRouter } from "next/router";
import { pruneNullOrUndefinedFields } from "../../utils/functions";
import { countryDataCodes } from "../../config/countries";

const FirstTimeDepositsTable = () => {
  const notify = useNotification();
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
    ["firstTimeDeposits", router.query],
    (params) =>
      agent()
        .getFirstTimeDeposits(params)
        .then((res) => res.data),
    {
      queryOptions: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      availableFields: availableFields.FIRST_TIME_DEPOSITS,
      fieldFunctionality: {
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
            doc?.processed_currency
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
        country: {
          format: (v) => {
            const country =
              countryDataCodes.find((c) => c.iso2.toUpperCase() === v)?.name ||
              v;
            try {
              return country.split("(")[0].trim();
            } catch (e) {
              return v;
            }
          },
        },
      },
    }
  );
  return (
    <div>
      <div>
        <FilterContainer style={{ justifyContent: "space-between" }}>
          {/* <div /> */}
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
          <FilterInnerContainer
            style={{
              justifyContent: "space-between",
              width: "fit-content",
            }}
          >
            <FieldsFilter
              availbleFields={availableFields.FIRST_TIME_DEPOSITS}
              title="FTD Fields"
            />
            <RefreshButton
              onClick={() =>
                refetch().then(() => {
                  notify.SUCCESS("Table Refreshed");
                })
              }
              isLoading={isLoading || isFetching}
            />
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
};

export default FirstTimeDepositsTable;
