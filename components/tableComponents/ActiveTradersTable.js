import availableFields from "../../config/tablesAvailableFields";
import agent from "../../utils/agent";
import { getDeviceIcon } from "../../utils/helpers";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import PCR from "../PCR";
import { useNotification } from "../actionNotification/NotificationProvider";
import GridTable from "./GridTable";
import RefreshButton from "./RefreshButton";
import {
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
  TableExport,
} from "./TableGeneric";

import { DateTime } from "luxon";

const ActiveTradersTable = () => {
  const notify = useNotification();
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
    ["firstTimeDeposits"],
    (params) =>
      agent()
        .getActiveTraders(params)
        .then((res) => res.data),
    {
      queryOptions: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      availableFields: availableFields.ACTIVE_TRADERS,
      fieldFunctionality: {
        deviceType: {
          format: (v) => (
            <div style={{ textAlign: "center" }}>{getDeviceIcon(v)}</div>
          ),
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
          <div />
          <FilterInnerContainer
            style={{
              justifyContent: "space-between",
              width: "fit-content",
            }}
          >
            <RefreshButton
              onClick={() =>
                refetch().then(() => {
                  notify.SUCCESS("Table Refreshed");
                })
              }
              isLoading={isLoading || isFetching}
            />
            <PCR.export>
              <TableExport
                selectedFields={selectedFields}
                exportFunction={agent().getActiveTraders}
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

export default ActiveTradersTable;
