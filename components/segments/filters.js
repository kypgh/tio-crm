import { countryDataCodes } from "../../config/countries";
export const allowedOperators = ["eq", "ne", "gt", "gte", "lt", "lte"];
export const mappedOperators = {
  eq: "is equal to",
  ne: "is not equal to",
  gt: "is greater than",
  gte: "is greater than or equal to",
  lt: "is less than",
  lte: "is less than or equal to",
};
export const filterTypesArr = [
  {
    name: "KYC Approved",
    type: "kycStatus",
    operators: ["is"],
    values: ["true", "false"],
    inputType: "select",
  },
  {
    name: "Device Type",
    type: "deviceType",
    operators: ["is"],
    values: [
      { label: "Windows", value: "win" },
      { label: "Android", value: "android" },
      { label: "iOS", value: "ios" },
    ],
    inputType: "multiselect",
  },
  {
    name: "Live Accounts",
    type: "liveAccounts",
    operators: allowedOperators,
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    inputType: "select",
  },
  {
    name: "Demo Accounts",
    type: "demoAccounts",
    operators: allowedOperators,
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    inputType: "select",
  },
  {
    name: "First Time Deposit Amount (USD)",
    type: "ftdAmount",
    operators: allowedOperators,
    values: [],
    inputType: "number",
  },
  // {
  //   name: "Created At",
  //   type: "createdAt",
  //   operators: ["is"],
  //   values: [
  //     "today",
  //     "yesterday",
  //     "last 7 days",
  //     "last 30 days",
  //     "this month",
  //     "last month",
  //     "custom",
  //   ],
  //   inputType: "date",
  // },
  {
    name: "From Date",
    type: "fromDate",
    operators: ["is"],
    values: [],
    inputType: "date",
  },
  {
    name: "To Date",
    type: "toDate",
    operators: ["is"],
    values: [],
    inputType: "date",
  },
  {
    name: "User Deposits",
    type: "userDeposits",
    operators: ["gt", "gte", "lt", "lte"],
    values: ["100", "1000", "10000", "100000"],
    inputType: "select",
  },
  {
    name: "Country",
    type: "country",
    operators: ["is in"],
    values: countryDataCodes.map((x) => ({ value: x.iso2, label: x.name })),
    inputType: "multiselect",
  },
];
