import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { DateTime } from "luxon";

import agent from "../agent";
import useSelectedBrand from "./useSelectedBrand";
import useUser from "./useUser";

/**
 * @param {string} requestId - The id of the account.
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useRequestByIdQuery = (requestId, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "requests", requestId],
    () =>
      agent()
        .getClientsRequestById(requestId)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {string} clientId - The id of the account.
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useClientDetailsByID = (clientId, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "client", clientId],
    () =>
      agent()
        .getClientById(clientId)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useClientSegments = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "clientsSegments"],
    () =>
      agent()
        .getAllSegments()
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 *
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} from - from currency
 * @param {string} to - to currency
 * @returns {UseQueryResult} The result of the query.
 */
export const useExchangeRates = (from, to, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "exchangeRate", from, to],
    () =>
      agent()
        .getExchangeRates({ from, to })
        .then((res) => res.data),
    { enabled: !!data && !!from && !!to, ...options }
  );
};

/**
 *
 * @param {string} accountId
 * @param {string} page
 * @param {string} limit
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useAccountOpenTrades = (accountId, page, limit, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "openTrades", accountId, page, limit],
    () =>
      agent()
        .getAccountOpenTrades({
          accountId,
          page,
          limit,
        })
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 *
 * @param {string} accountId
 * @param {string} page
 * @param {string} limit
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useAccountClosedTrades = (accountId, page, limit, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "closedTrades", accountId, page, limit],
    () =>
      agent()
        .getAccountClosedTrades({
          accountId,
          page,
          limit,
        })
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {string} documentID - The id of the doc.
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useDocumentbyID = (documentID, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "document", documentID],
    () =>
      agent()
        .getDocumentById(documentID)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useAvailablePermissions = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "availablePermissions"],
    () =>
      agent()
        .getAvailablePermissions()
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useUserRoles = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "crmUsersRoles"],
    () =>
      agent()
        .getAllRoles()
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {string} clientId - The id of the account.
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useClientExtraDetails = (clientId, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "clientExtraDetails", clientId],
    () =>
      agent()
        .getClientExtraDetails(clientId)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} clientId - The id of the account.
 * @param { 'live' | 'demo' } enviroment - The enviroment of the account.
 * @returns {UseQueryResult} The result of the query.
 */
export const useClientAccounts = (clientId, enviroment = "live", options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "clientAccounts", clientId, enviroment],
    () =>
      agent()
        .getClientAccounts(clientId, enviroment)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} clientId - The id of the account.
 * @returns {UseQueryResult} The result of the query.
 */
export const useGetClientAccountDetails = (accountId, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "clientAccountDetails", accountId],
    () =>
      agent()
        .getClientAccount(accountId)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {string} clientId - The id of the account.
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useClientKycDocuments = (clientId, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "clientKycDocuments", clientId],
    () =>
      agent()
        .getClientKycDocuments(clientId)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} page
 * @param {string} limit
 * @param {string} user_id
 * @param {string} transaction_type
 * @param {string} status
 * @param {string} sort
 * @param {Object} filters
 * @returns {UseQueryResult} The result of the query.
 */
export const useTransactions = (
  page = 1,
  limit = 50,
  user_id,
  transaction_type,
  status,
  sort,
  filters,
  options
) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [
      selectedBrand,
      "transactions",
      user_id,
      page,
      limit,
      transaction_type,
      status,
      sort,
      filters,
    ],
    () =>
      agent()
        .getTransactions(
          page,
          limit,
          user_id,
          transaction_type,
          status,
          sort,
          filters
        )
        .then((res) => {
          const { docs, ...rest } = res.data;

          return {
            ...rest,
            docs,
            newDocs: docs.reduce((t, c) => {
              if (t[DateTime.fromISO(c.createdAt).toFormat("LLL d, y")]) {
                t[DateTime.fromISO(c.createdAt).toFormat("LLL d, y")].push(c);
              } else {
                t[DateTime.fromISO(c.createdAt).toFormat("LLL d, y")] = [c];
              }
              return t;
            }, {}),
          };
        }),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} clientId - The id of the account.
 * @returns {UseQueryResult} The result of the query.
 */
export const useFinancialNotes = (clientId, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "financialNotes", clientId],
    () =>
      agent()
        .getAllFinancialNotes(clientId)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} clientId - The id of the account.
 * @param {string} page
 * @param {string} limit
 * @param {Object} filters - The filters of the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useUserLogs = (clientId, page, limit, fitlers, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "userLogs", clientId, page, limit, fitlers],
    () =>
      agent()
        .getUserLogs(clientId, page, limit, fitlers)
        .then((res) => {
          const { docs, ...rest } = res.data;
          return {
            ...rest,
            docs: docs.map((x, i) => ({
              ...x,
              cDate: new Date(x.createdAt).toLocaleDateString("en-GB"),
            })),
          };
        }),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} clientId - The id of the account.
 * @returns {UseQueryResult} The result of the query.
 */
export const useNotes = (clientId, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "notes", clientId],
    () =>
      agent()
        .getAllNotes(clientId)
        .then((res) => res.data.docs),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} page
 * @param {string} limit
 * @param {string} request_type
 * @param {string} user_id
 * @param {string} status
 * @param {string} sort
 * @returns {UseQueryResult} The result of the query.
 */
export const useClientRequests = (
  page = 1,
  limit = 50,
  request_type,
  user_id,
  status,
  sort,
  options
) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [
      selectedBrand,
      "clientRequests",
      user_id,
      page,
      limit,
      request_type,
      status,
      sort,
    ],
    () =>
      agent()
        .getClientsRequests(page, limit, request_type, user_id, status, sort)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} page
 * @param {string} limit
 * @param {string} status
 * @param {string} sort
 * @returns {UseQueryResult} The result of the query.
 */
export const useClientDocuments = (
  page = 1,
  limit = 50,
  status,
  sort,
  options
) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "clientDocuments", page, limit, status, sort],
    () =>
      agent()
        .getAllClientsDocuments({ page, limit, status, sort })
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const usePendingRequests = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "pendingRequests"],
    () =>
      agent()
        .getPendingRequests({})
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const usePendingWithdrawals = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "pendingWithdrawals"],
    () =>
      agent()
        .getPendingWithdrawals({})
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const usePendingDeposits = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "pendingDeposits"],
    () =>
      agent()
        .getPendingDeposits({})
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} type - The type of the ribbons.
 * @param {string} id - The id of the ribbons.
 * @returns {UseQueryResult} The result of the query.
 */
export const useRibbons = (type, id, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "ribbons"],
    () =>
      agent()
        .getAllRibbons(type, id)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} segmentId - The id of the segment.
 * @returns {UseQueryResult} The result of the query.
 */
export const useClientBySegment = (segmentId, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "clientBySegment", segmentId],
    () =>
      agent()
        .getClientsBySegment(segmentId)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

export const useSearchClientByField = (field, value, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "searchClientByField", field, value],
    () =>
      agent()
        .searchClientsByField(field, value)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @param {string} page
 * @param {string} limit
 * @param {string} sort
 * @returns {UseQueryResult} The result of the query.
 */
export const useCrmUsers = (page, limit, sort, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "crmUsers"],
    () =>
      agent()
        .getAllCrmUsers(page, limit, sort)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useLatestTransactions = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "latestTransactions"],
    () =>
      agent()
        .getLatestTransactions()
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {page} page - The page of the query.
 * @param {limit} limit - The limit of the query.
 * @param {sort} sort - The sort of the query.
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useSalesCrmUsers = (page, limit, sort, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "salesCrmUsers", page, limit, sort],
    () =>
      agent()
        .getAllCrmUsers(page, limit, sort, "sales")
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useUsersPerDevice = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "usersPerDevice"],
    () =>
      agent()
        .getUsersPerDevice()
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useUsersPerTimeframe = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "usersPerTimeframe"],
    () =>
      agent()
        .getUsersPerTimeframe()
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useUsersPerCountry = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "usersPerCountry"],
    () =>
      agent()
        .getUsersPerCountry()
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useDailyTransactionsForThisMonth = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "dailyTransactionsForThisMonth"],
    () =>
      agent()
        .getDailyTransactionsForThisMonth()
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useLatestClients = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "latestClients"],
    () =>
      agent()
        .getAllClients({ page: 1, limit: 10 })
        .then((res) => res?.data),
    { enabled: !!data, ...options }
  );
};

export const useGetOtherCrmUsers = (page, limit, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "otherCrmUsers", page, limit],
    () =>
      agent()
        .getOtherCrmUsers({ page, limit })
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {string} type
 * @param {string} page
 * @param {string} limit
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useGetLogsByType = (type, page, limit, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "logsByType", type, page, limit],
    () =>
      agent()
        .getLogsByType(type, page, limit)
        .then((res) => res.data),
    { enabled: !!data && options?.enabled, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useBlogArticles = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "blogArticles"],
    () =>
      fetch("/api/rss/articles")
        .then((response) => response.json())
        .then((data) => data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {string} id
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useIsAllowedToChangeEmail = (id, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "isAllowedToChangeEmail", id],
    () =>
      agent()
        .checkIsAllowedToChangeEmail(id)
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {object} params
 * @param {string} params.user_id
 * @param {string} [params.environment_type="live"]
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useGetUserAccountTypes = (
  { user_id, environment_type = "live" },
  options
) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "getUserAccountTypes", user_id, environment_type, options],
    () =>
      agent()
        .getUserAccountTypes({ user_id, environment_type })
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {object} params
 * @param {string} params.user_id
 * @param {Date} [params.start]
 * @param {Date} [params.end]
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useGetUserCalendarEvents = ({ user_id, start, end }, options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "getUserCalendarEvents", user_id, start, end],
    () =>
      agent()
        .getUserCalendarEvents({ user_id, start, end })
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
export const useGetBalanceReport = (options) => {
  const [selectedBrand] = useSelectedBrand();
  const { data } = useUser();
  return useQuery(
    [selectedBrand, "getBalanceReport"],
    () =>
      agent()
        .getBalanceReport()
        .then((res) => res.data),
    { enabled: !!data, ...options }
  );
};
