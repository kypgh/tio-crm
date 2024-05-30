import React, { useState } from "react";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import agent from "../../utils/agent";
import availableFields from "../../config/tablesAvailableFields";
import {
  FieldsFilter,
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
} from "./TableGeneric";
import InputFilters, {
  filtersObjectToString,
  filtersStringToObject,
} from "../formComponents/InputFilters";
import GridTable from "./GridTable";
import { useRouter } from "next/router";
import FiltersBar from "./FiltersBar";
import filterOptions from "../../config/filtersOptions";
import { DateTime } from "luxon";
import RefreshButton from "./RefreshButton";
import { useNotification } from "../actionNotification/NotificationProvider";
import { ButtonBlue } from "../generic";
import { pruneNullOrUndefinedFields } from "../../utils/functions";
import styled from "styled-components";
import DatePicker from "../DatePicker";

const Flex = styled.div`
  display: flex;
  align-items: stretch;
  gap: 5px;
`;

const utmsArray = [
  {
    value: "utm_campaign",
    label: "Utm Campaign",
  },
  {
    value: "utm_source",
    label: "Utm Source",
  },
  {
    value: "utm_medium",
    label: "Utm Medium",
  },
  {
    value: "utm_term",
    label: "Utm Term",
  },
  {
    value: "utm_content",
    label: "Utm Content",
  },
];

const UtmsTable = () => {
  const [filters, setFilters] = useState({});
  const notificationManager = useNotification();
  const router = useRouter();
  const {
    data,
    selectedFields,
    tableRows,
    isLoading,
    isFetching,
    resizeFields,
    reorderFields,
    refetch,
  } = useTabledQuery(
    ["utmsTable", router.query],
    (params) =>
      agent()
        .getAllClients(params)
        .then((res) => res.data),
    {
      availableFields: availableFields.UTMS,
      rowFunctionality: (item) => {
        router.push({ pathname: `/clients/${item._id}` });
      },
      fieldFunctionality: {
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
      <FilterContainer
        style={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: "column-reverse",
        }}
      >
        <FilterInnerContainer style={{ alignItems: "center" }}>
          {utmsArray.map(({ value, label }) => (
            <InputFilters
              key={value}
              filterKey={value}
              label={label}
              placeholder={`${label}...`}
              onChange={({ value, key }) => {
                if (value === "") {
                  setFilters((prev) =>
                    pruneNullOrUndefinedFields({ ...prev, [key]: null })
                  );
                } else {
                  setFilters((prev) => ({ ...prev, [key]: value }));
                }
              }}
              onClear={({ key }) =>
                setFilters((prev) =>
                  pruneNullOrUndefinedFields({ ...prev, [key]: null })
                )
              }
            />
          ))}
          <ButtonBlue
            style={{
              alignSelf: "flex-end",
              marginBottom: "1px",
            }}
            onClick={() => {
              const existingFilters = pruneNullOrUndefinedFields(
                filtersStringToObject(router.query.filters)
              );
              const newFilters = pruneNullOrUndefinedFields({
                ...existingFilters,
                ...filters,
              });

              if (_.isEmpty(newFilters)) return;
              return router.push(
                {
                  query: {
                    ...router.query,
                    filters: filtersObjectToString(newFilters),
                  },
                },
                undefined,
                { shallow: true }
              );
            }}
          >
            Filter
          </ButtonBlue>
        </FilterInnerContainer>
        <FilterInnerContainer
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* <FiltersBar
            allowedFilters={filterOptions.UTMS}
            keysToExclude={utmsArray.map((el) => el.value)}
          /> */}
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
          <Flex>
            <FieldsFilter
              availbleFields={availableFields.UTMS}
              title="Utms Fields"
            />
            <RefreshButton
              onClick={() => {
                refetch().then(() => {
                  notificationManager.SUCCESS("Table Refreshed");
                });
              }}
              isLoading={isLoading || isFetching}
            />
          </Flex>
        </FilterInnerContainer>
      </FilterContainer>
      <GridTable
        isLoading={isLoading || isFetching}
        headers={selectedFields}
        onReorder={reorderFields}
        onResize={resizeFields}
        minusHeight={340}
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

export default UtmsTable;
