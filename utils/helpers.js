import _ from "lodash";
import { AiFillApple, AiFillAndroid, AiFillWindows } from "react-icons/ai";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowCircleUp,
  FaArrowCircleDown,
} from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { HiDotsHorizontal, HiX } from "react-icons/hi";

import { countryDataCodes } from "../config/countries";
import {
  CRYPTO_CURRENCIES,
  CURRENCIES,
  CURRENCY_SYMBOLS,
} from "../config/currencies";
import { CTRADER_ACCOUNT_TYPPES } from "../config/ctraderEnums";

export const getCountryObject = (iso) => {
  return countryDataCodes[
    _.findIndex(countryDataCodes, { iso2: iso?.toLowerCase() || "cy" })
  ];
};

export const monthsForLocale = (
  localeName = "en-GB",
  monthFormat = "short"
) => {
  const format = new Intl.DateTimeFormat(localeName, { month: monthFormat })
    .format;
  return [...Array(12).keys()].map((m) =>
    format(new Date(Date.UTC(2021, m % 12)))
  );
};

export const getDeviceIcon = (deviceString) => {
  switch (deviceString) {
    case undefined:
      return <AiFillWindows color="#00A2ED" size={16} />;
    case "iOS":
      return <AiFillApple color="#5C5B57" size={16} />;
    case "android":
      return <AiFillAndroid color="#3DDC84" size={16} />;
    case "windows":
      return <AiFillWindows color="#00A2ED" size={16} />;
    default:
      return <AiFillWindows color="#00A2ED" size={16} />;
  }
};

export const getTransactionIcon = (transactionType) => {
  switch (transactionType) {
    case "deposit":
      return <FaArrowUp color={"green"} size={16} />;
    case "withdrawal":
      return <FaArrowDown color={"red"} size={16} />;
    case "balance_operation_deposit":
      return <FaArrowCircleUp color={"green"} size={16} />;
    case "balance_operation_withdrawal":
      return <FaArrowCircleDown color={"red"} size={16} />;
    default:
      return "";
  }
};

export const getTransactionStatusIcon = (transactionStatus) => {
  switch (transactionStatus) {
    case "approved":
      return <GiCheckMark color={"green"} size={16} />;
    case "rejected":
    case "error":
      return <HiX color={"red"} size={16} />;
    default:
      return <HiDotsHorizontal color={"#CCCC00"} size={16} />;
  }
};

/**
 *
 * @param {Number} year
 * @param {Number} month - Indexed 0-11
 * @returns
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 *
 * @param {string} s
 * @param {number} maxBytes
 * @returns {string[]}
 */
export function chunkStrings(s, maxLength) {
  let result = [];
  let idx = 0;
  let chunk = s.substring(idx, maxLength);

  while (chunk.length > 0) {
    result.push(chunk);
    idx += maxLength;
    chunk = s.substring(idx, idx + maxLength);
  }
  return result;
}

/**
 *
 * @param {string | number} amount
 * @param {string} currency
 * @returns
 */
export function formatCurrency(amount, currency, includeSymbol = true) {
  try {
    if (!currency) return amount;
    if (isNaN(amount)) return "NaN";
    const curr = CURRENCIES[currency.toUpperCase()];
    if (curr) {
      if (includeSymbol) {
        return `${curr.symbol} ${parseFloat(amount).toFixed(curr.digits)}`;
      } else {
        return parseFloat(amount).toFixed(curr.digits);
      }
    }
    return parseFloat(amount).toLocaleString("en", {
      style: "currency",
      currency,
    });
  } catch (err) {
    console.error(err);
    if (isNaN(amount)) return "NaN";
    const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
    return symbol + amount;
  }
}

export function getClientIdString(client) {
  if (!client) return "";
  return client.readableId;
  // return (
  //   [
  //     client?.ctrader_id && `CT-${client?.ctrader_id}`,
  //     client?.mt5_id && `MT5-${client?.mt5_id}`,
  //   ]
  //     .filter((v) => !!v)
  //     .join(", ") ||
  //   `${client?.first_name} ${client?.last_name}
  // `
  // );
}

export function getClientIdForPlatform(client, platform) {
  if (!client) return "";
  if (platform === "ctrader") return `CT-${client.ctrader_id}`;
  if (platform === "mt5") return `MT5-${client.mt5_id}`;
  return client._id;
}

export function getAccountIdString(account) {
  if (!account) return "";
  if (account.platform === "ctrader") return `CT-${account.login_id}`;
  if (account.platform === "mt5") return `MT5-${account.login_id}`;
  if (account.platform === "mt4") return `MT4-${account.login_id}`;
  return account.login_id;
}

/**
 *
 * @param {string} searchText
 * @param {string} query
 * @returns
 */
export function searchScore(searchText = "", query = "") {
  let score = 0;
  let consecutiveScore = 0;

  // Convert both the search text and query to lowercase for case-insensitive matching
  let searchTextLower = searchText.toLowerCase();
  const queryLower = query.toLowerCase();

  // Calculate the score based on the number of matched characters
  for (let i = 0; i < queryLower.length; i++) {
    if (searchTextLower.includes(queryLower[i])) {
      score++;

      // Check if the current character in the query is consecutive to the previous matched character
      if (i > 0 && queryLower[i - 1] === queryLower[i]) {
        consecutiveScore++;
      }
      searchTextLower = searchTextLower.replace(queryLower[i], "");
    }
  }

  // Add the consecutive score to the overall score
  score += consecutiveScore;

  return score;
}

export const getAccountTypeDetails = (
  { environment_type, account_type, platform },
  brand
) => {
  try {
    if (platform === "ctrader")
      return CTRADER_ACCOUNT_TYPPES[brand][environment_type][account_type];
    return {
      name: account_type,
      label: account_type,
    };
  } catch (err) {
    return {
      name: account_type,
      label: account_type,
    };
  }
};
