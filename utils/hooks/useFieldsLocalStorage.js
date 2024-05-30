import { useEffect } from "react";
import { useRouter } from "next/router";
import _ from "lodash";

function reduceFields(fields) {
  return fields
    .reduce((acc, curr) => {
      if (typeof curr.selected !== "boolean" || !curr.value) {
        throw new Error("Invalid fields object");
      }
      return curr.selected ? [...acc, curr.value] : acc;
    }, [])
    .join(",");
}

export default function useFieldsLocalStorage(availableFields = []) {
  const router = useRouter();

  const setField = (newFields) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          fields: reduceFields(newFields),
        },
      },
      undefined,
      { shallow: true }
    );
    localStorage.setItem(
      `${router.pathname}-fields`,
      JSON.stringify(newFields)
    );
  };

  return [
    availableFields
      .filter((x) => typeof x.custom !== "boolean" && !x.custom)
      .map((x) => {
        if (
          router.query.fields &&
          typeof router.query.fields === "string" &&
          router.query.fields !== ""
        ) {
          let routerFields = router.query.fields?.split(",");
          if (_.isObject(x))
            return {
              ...x,
              selected: routerFields.includes(x.value),
            };
          return {
            value: x,
            label: x,
            selected: routerFields.includes(x.value),
          };
        } else {
          if (_.isObject(x))
            return {
              ...x,
              selected: x.hasOwnProperty("selected") ? x.selected : false,
            };
          return { value: x, label: x, selected: false };
        }
      }),
    setField,
  ];
}
