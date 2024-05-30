import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import useSelectedBrand from "./useSelectedBrand";
import useUser from "./useUser";

/**
 *
 * @param {String[]} key
 * @param {{page: Number, limit: Number, sort: String, search: String, filters: String}} param1
 * @returns
 */
export function createQueryKeyTabled(
  key,
  { page = 1, limit = 50, sort = null, search = null, filters = null }
) {
  return [...key, page, limit, sort, search, filters];
}

/**
 *
 * @param {String[]} queryKey
 * @param {({ page, limit, sort, search, filters }) => Promise<any>} queryFn
 * @param {{ fieldFunctionality: { ["fieldName"]: (val) => {} }, rowFunctionality: (doc) => {}, availableFields: Object, queryOptions: UseQueryOptions}} param2
 * @returns {{
 *  ...UseQueryResult,
 *  selectedFields: Object[],
 *  tableRows: [{
 *    _id: String,
 *    doc: Object,
 *    fields: [{
 *      key: String,
 *      value: String | JSX,
 *      onClick: Function
 *    }],
 *    onClick: Function
 *  }],
 *  reorderFields: (newOrder) => void
 * }}
 */
export default function useTabledQuery(
  queryKey,
  queryFn,
  {
    fieldFunctionality = {},
    rowFunctionality = () => {},
    availableFields = [],
    options = {},
  }
) {
  const router = useRouter();
  const [orderedFields, setOrderedFields] = useState(
    availableFields.map((x, idx) => ({ ...x, order: idx }))
  );
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  const query = useQuery(
    createQueryKeyTabled([selectedBrand, ...queryKey], router.query),
    () =>
      queryFn({
        page: router.query.page ?? 1,
        limit: router.query.limit ?? 50,
        sort: router.query.sort,
        search: router.query.search,
        filters: router.query.filters,
      }),
    { enabled: !!data, ...options }
  );
  const selectedFields = (
    router.query.fields && query.data?.docs
      ? orderedFields.filter(
          (field) => router.query.fields.includes(field.value) || field.custom
        )
      : orderedFields.filter((field) => field.selected)
  ).filter((field) => {
    if (data?.user?.role.name === "admin") return true;
    if (!field.hasOwnProperty("permissions")) return true;
    return field.permissions.every((perm) =>
      data?.user?.permissions?.includes(perm.value)
    );
  });

  const tableRows =
    query.data?.docs?.map((client) => {
      const row = {};
      row._id = client._id;
      row.onClick = () => rowFunctionality(client);
      row.doc = client;
      row.fields = selectedFields.map((field) => {
        let value = _.get(client, field.key);
        const { format, onClick = () => {} } =
          fieldFunctionality[field.value] || {};
        if (typeof format === "function") {
          value = format(value, client);
        }
        return {
          onClick: () => onClick(value, client),
          value,
          key: field.key,
        };
      });
      return row;
    }) || [];

  function reorderFields(newOrder) {
    let idx = -1;
    for (let i = 0; i < newOrder.length; i++) {
      let tempIdx = orderedFields.findIndex(
        (x) => x.value === newOrder[i].value
      );
      if (tempIdx < idx) {
        let temp = orderedFields[tempIdx].order;
        orderedFields[tempIdx].order = orderedFields[idx].order;
        orderedFields[idx].order = temp;
        setOrderedFields([...orderedFields.sort((a, b) => a.order - b.order)]);
        return;
      }
      idx = tempIdx;
    }
  }

  function resizeFields(header, width) {
    setOrderedFields(
      orderedFields.map((x) =>
        x.value === header.value
          ? { ...x, gridColumnSize: `minmax(${width}px, 1fr)` }
          : x
      )
    );
  }
  return { ...query, selectedFields, tableRows, reorderFields, resizeFields };
}
