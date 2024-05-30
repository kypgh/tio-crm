import { getDaysInMonth } from "./helpers";
import { v4 as uuid } from "uuid";
import _ from "lodash";
import { filterTypesArr } from "../components/segments/filters";

export const searchData = (setState, data, query, exceptions = []) => {
  setState(
    data.filter((x) =>
      Object.entries(x).some(
        (el) =>
          typeof el[1] === "string" &&
          exceptions.indexOf(el[0]) === -1 &&
          el[1].toLowerCase().includes(query.toLowerCase())
      )
    )
  );
};

/**
 * @param {{
 *    ["filter"]: String
 *                | [String]
 *                | {operator: "[ne]"|"[lt]"|"[lte]"|"[gt]"|"[gte]", value: String | [String]}
 *                | [{operator: "[ne]"|"[lt]"|"[lte]"|"[gt]"|"[gte]", value: String | [String]}]
 *  }} filters
 * @returns {String}
 */
export const formatFilters = (filters) => {
  return Object.entries(filters)
    .reduce((acc, curr) => {
      const filter = curr[0];
      const val = curr[1];
      if (_.isNil(val)) return acc;
      if (typeof val === "object") {
        acc.push(
          `${filter}${val.operator}:${
            Array.isArray(val.value) ? val.value.join("|") : val.value
          }`
        );
      } else if (Array.isArray(val)) {
        if (val.every((v) => typeof v === "string")) {
          acc.push(`${filter}:${val.join("|")}`);
        } else if (val.every((v) => typeof v === "object")) {
          for (const v in val) {
            acc.push(
              `${filter}${v.operator}:${
                Array.isArray(v.value) ? v.value.join("|") : v.value
              }`
            );
          }
        } else {
          throw new Error(
            "Invalid filter value can only be a list of strings or objects not both"
          );
        }
      } else {
        acc.push(`${filter}:${val}`);
      }
      return acc;
    }, [])
    .join(",");
};

/**
 *
 * @param {Object} obj
 *
 * Removes all keys which have either null or undefined values
 */
export const pruneNullOrUndefinedFields = (obj) => {
  function recursiveTransform(result, value, key) {
    if (_.isPlainObject(value)) {
      let objRes = _.transform(value, recursiveTransform, {});
      if (!_.isEmpty(objRes)) {
        result[key] = objRes;
      }
      return result;
    }
    if (!_.isNil(value)) {
      result[key] = value;
    }
    return result;
  }
  return _.transform(obj, recursiveTransform);
};

/**
 *
 * @param {Object} obj
 *
 * Removes all keys which have either null or undefined values
 */
export const filterObj = (obj, checkFn) => {
  function recursiveTransform(result, value, key) {
    if (_.isPlainObject(value)) {
      let objRes = _.transform(value, recursiveTransform, {});
      if (!_.isEmpty(objRes)) {
        result[key] = objRes;
      }
      return result;
    }
    if (checkFn(value)) {
      result[key] = value;
    }
    return result;
  }
  return _.transform(obj, recursiveTransform);
};

export const formatSegmentFilters = (filters) => {
  if (
    filters.some(
      (f) =>
        f.operator === "" ||
        f.value === "" ||
        f.inputType === "" ||
        f.type === ""
    )
  )
    return;

  const allowedOperators = ["eq", "ne", "gt", "gte", "lt", "lte"];
  const deviceMap = {
    Android: "android",
    iOS: "iOS",
    Windows: "win",
  };

  return filters
    .map((curr) => {
      switch (curr.inputType) {
        case "multiselect":
          return `${curr.type}:${curr.value
            .map((x) => deviceMap[x] || x)
            .join("|")}`;
        case "select":
          return `${curr.type}${
            allowedOperators.some((x) => x === curr.operator)
              ? `[${curr.operator}]`
              : ""
          }:${curr.value}`;
        case "date":
          return `${curr.type}${
            allowedOperators.some((x) => x === curr.operator)
              ? `[${curr.operator}]`
              : ""
          }:${curr.value}`;
        default:
          return `${curr.type}:${curr.value}`;
      }
    })
    .join(",");
};

export const parseFiltersStringToFiltersObjSegments = (filterString) => {
  const filters = filterString.split(",");
  if (filters.length === 0) return [];
  return filters.map((v) => {
    let [type, value] = v.split(":");
    let [field, operator] = type.split("[");
    if (!operator) {
      operator = "eq";
    } else {
      operator = operator.slice(0, -1);
    }
    let filterOptions = filterTypesArr.find((x) => x.type === field) || {};
    if (filterOptions.inputType === "multiselect") {
      value = value.split("|");
    } else if (filterOptions.inputType === "date") {
      let date = new Date(value);
      value = date.toISOString().split("T")[0];
    }
    return {
      uuid: uuid(),
      type: field,
      name: filterOptions.name ?? "ERROR",
      inputType: filterOptions.inputType,
      operator,
      value,
    };
  });
};

/**
 *
 * @param {String} filterString
 * @returns {[{uuid: String, type: String, operator: String, value: [String]}]}
 */
export const parseFiltersStringToFiltersObj = (filterString) => {
  if (typeof filterString !== "string") return filterString;
  if (filterString.trim() === "") return [];
  const filters = filterString.split(",");
  return filters.map((v) => {
    let [type, value] = v.split(":");
    let [field, operator] = type.split("[");
    if (!operator) {
      operator = "eq";
    } else {
      operator = operator.slice(0, -1);
    }

    return {
      uuid: uuid(),
      type: field,
      operator,
      value: value.split("|"),
    };
  });
};

/**
 *
 * This fuction is used to parse the filters from segments and format them to be displayed in the UI
 * It might need some changes in the future if more filters are added
 */
export const parseSegmentFilters = (filters) => {
  const deviceMap = {
    android: "Android",
    iOS: "iOS",
    win: "Windows",
  };
  const mappedOperators = {
    "[eq]": "is equal to",
    "[ne]": "is not equal to",
    "[gt]": "is greater than",
    "[gte]": "is greater than or equal to",
    "[lt]": "is less than",
    "[lte]": "is less than or equal to",
  };
  const availableOperators = Object.keys(mappedOperators);
  return filters.split(",").map((el, idx) => {
    let res = {};
    const [field, value] = el.split(":");
    if (availableOperators.some((x) => field.includes(x))) {
      const [type, operator] = field.split("[");
      res = { field: type, operator: mappedOperators[`[${operator}`], value };
    } else {
      res = { field, operator: "is", value };
    }
    if (value.includes("|")) {
      res.valueIsArray = true;
      res.value = value.split("|").map((x) => deviceMap[x] || x);
    }
    return res;
  });
};

export const filtersToString = (filters) => {
  if (typeof filters === "string") return filters;
  if (
    filters.some(
      (f) =>
        f.operator === "" ||
        f.value === "" ||
        f.inputType === "" ||
        f.type === ""
    )
  )
    return;

  const allowedOperators = ["eq", "ne", "gt", "gte", "lt", "lte"];
  const deviceMap = {
    Android: "android",
    iOS: "iOS",
    Windows: "win",
  };

  return filters
    .map(
      (curr) =>
        `${curr.type}${
          allowedOperators.some((x) => x === curr.operator)
            ? `[${curr.operator}]`
            : ""
        }:${curr.value.map((v) => deviceMap[v] || v).join("|")}`
    )
    .join(",");
};

//function to convert hex to rgb
export const hexToRgb = (hex) => {
  //check if it is a rgba color
  if (hex.indexOf("rgba") !== -1) {
    return hex;
  }
  //check if it is a hex color
  if (hex.indexOf("#") !== -1) {
    let hexColor = hex.replace("#", "");
    let r, g, b;
    //check if it is a 3 digit hex color
    if (hexColor.length === 3) {
      r = parseInt(hexColor.substring(0, 1) + hexColor.substring(0, 1), 16);
      g = parseInt(hexColor.substring(1, 2) + hexColor.substring(1, 2), 16);
      b = parseInt(hexColor.substring(2, 3) + hexColor.substring(2, 3), 16);
    }
    //check if it is a 6 digit hex color
    else if (hexColor.length === 6) {
      r = parseInt(hexColor.substring(0, 2), 16);
      g = parseInt(hexColor.substring(2, 4), 16);
      b = parseInt(hexColor.substring(4, 6), 16);
    }
    //check if it is a 8 digit hex color
    else if (hexColor.length === 8) {
      r = parseInt(hexColor.substring(0, 2), 16);
      g = parseInt(hexColor.substring(2, 4), 16);
      b = parseInt(hexColor.substring(4, 6), 16);
    }
    //check if it is a 4 digit hex color
    else if (hexColor.length === 4) {
      r = parseInt(hexColor.substring(0, 1) + hexColor.substring(0, 1), 16);
      g = parseInt(hexColor.substring(1, 2) + hexColor.substring(1, 2), 16);
      b = parseInt(hexColor.substring(2, 3) + hexColor.substring(2, 3), 16);
    }
    //check if it is a 1 digit hex color
    else if (hexColor.length === 1) {
      r = parseInt(hexColor + hexColor, 16);
      g = parseInt(hexColor + hexColor, 16);
      b = parseInt(hexColor + hexColor, 16);
    }
    //check if it is a 2 digit hex color
    else if (hexColor.length === 2) {
      r = parseInt(hexColor, 16);
      g = parseInt(hexColor, 16);
      b = parseInt(hexColor, 16);
    }
    //return rgba color
    return `${r},${g},${b}`;
  }
  //return given color if it is not a hex color
  return hex;
};

export const flattenObject = (obj, prefix = "") =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object")
      Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});

export const filterObject = (obj, condition) => {
  let result = {};
  Object.entries(flattenObject(obj)).forEach(([key, value]) => {
    if (condition(key, value)) {
      _.set(result, key, value);
    }
  });
  return result;
};

export function parseJoiErrorsFromBackend(errorResponse) {
  if (errorResponse.details) {
    return errorResponse.details.map((detail) => ({
      path: detail.path,
      message: detail.message,
    }));
  }
  return [{ path: "unknown", message: "Unknown validation error" }];
}
