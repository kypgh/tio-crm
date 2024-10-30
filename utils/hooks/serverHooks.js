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
    {
      enabled: !!data,
      ...options,
      initialData: {
        page: 1,
        limit: 50,
        totalPages: 20,
        totalResults: 1000,
        docs: [
          {
            _id: "617f1f77bcf86cd799439011",
            user: {
              readableId: 1001,
              first_name: "John",
              last_name: "Doe",
              email: "johndoe@example.com",
            },
            userAccount: {
              platform: "MT5",
              login_id: "123456",
            },
            transaction_type: "Deposit",
            transaction_status: "Completed",
            amount: 100.0,
            processed_amount: 100.0,
            processed_usd_amount: 100.0,
            currency: "USD",
            processed_currency: "USD",
            fee: 0.0,
            variable1: "PROMO2024",
            variable2: "First deposit bonus",
            card: {
              card_type: "Visa",
              card_number: "**** **** **** 1234",
            },
            wallet: {
              account_identifier: "wallet123",
            },
            createdAt: "2024-10-01T12:00:00Z",
            updatedAt: "2024-10-01T12:05:00Z",
          },
          {
            _id: "617f1f77bcf86cd799439012",
            user: {
              readableId: 1002,
              first_name: "Jane",
              last_name: "Smith",
              email: "janesmith@example.com",
            },
            userAccount: {
              platform: "cTrader",
              login_id: "654321",
            },
            transaction_type: "Withdrawal",
            transaction_status: "Pending",
            amount: 200.0,
            processed_amount: null,
            processed_usd_amount: null,
            currency: "EUR",
            processed_currency: null,
            fee: 5.0,
            variable1: null,
            variable2: "Urgent processing requested",
            card: null,
            wallet: {
              account_identifier: "wallet456",
            },
            createdAt: "2024-10-02T14:30:00Z",
            updatedAt: "2024-10-02T14:35:00Z",
          },
          {
            _id: "617f1f77bcf86cd799439013",
            user: {
              readableId: 1003,
              first_name: "Carlos",
              last_name: "Gonzalez",
              email: "carlosg@example.com",
            },
            userAccount: {
              platform: "MT5",
              login_id: "789012",
            },
            transaction_type: "Deposit",
            transaction_status: "Failed",
            amount: 150.0,
            processed_amount: 0.0,
            processed_usd_amount: 0.0,
            currency: "USD",
            processed_currency: "USD",
            fee: 0.0,
            variable1: "REFERRAL2024",
            variable2: "Referral bonus",
            card: {
              card_type: "MasterCard",
              card_number: "**** **** **** 5678",
            },
            wallet: null,
            createdAt: "2024-10-03T09:45:00Z",
            updatedAt: "2024-10-03T09:50:00Z",
          },
          {
            _id: "617f1f77bcf86cd799439014",
            user: {
              readableId: 1004,
              first_name: "Akira",
              last_name: "Tanaka",
              email: "akira.tanaka@example.com",
            },
            userAccount: {
              platform: "cTrader",
              login_id: "210987",
            },
            transaction_type: "Withdrawal",
            transaction_status: "Completed",
            amount: 250.0,
            processed_amount: 250.0,
            processed_usd_amount: 225.0,
            currency: "JPY",
            processed_currency: "USD",
            fee: 10.0,
            variable1: null,
            variable2: null,
            card: null,
            wallet: {
              account_identifier: "wallet789",
            },
            createdAt: "2024-10-04T16:20:00Z",
            updatedAt: "2024-10-04T16:25:00Z",
          },
          {
            _id: "617f1f77bcf86cd799439015",
            user: {
              readableId: 1005,
              first_name: "Maria",
              last_name: "Silva",
              email: "maria.silva@example.com",
            },
            userAccount: {
              platform: "MT5",
              login_id: "345678",
            },
            transaction_type: "Deposit",
            transaction_status: "Completed",
            amount: 300.0,
            processed_amount: 300.0,
            processed_usd_amount: 300.0,
            currency: "USD",
            processed_currency: "USD",
            fee: 0.0,
            variable1: "WELCOME2024",
            variable2: "Welcome bonus",
            card: {
              card_type: "Amex",
              card_number: "**** **** **** 9012",
            },
            wallet: null,
            createdAt: "2024-10-05T11:10:00Z",
            updatedAt: "2024-10-05T11:15:00Z",
          },
          // Add more transaction objects as needed
        ],
      },
    }
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
    {
      enabled: !!data,
      ...options,
      initialData: {
        page: 1,
        limit: 50,
        totalPages: 20,
        totalResults: 1000,
        docs: [
          {
            readableId: 10001,
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@example.com",
            phone: "+123456789",
            nationality: "US",
            language: "en",
            country: "US",
            address: "123 Main St, Apt 4B, New York, 10001",
            dob: "1985-05-20",
            metadata: {
              deviceType: "android",
              utm_source: "google",
              utm_medium: "cpc",
              utm_campaign: "spring_sale",
              language: "en-US",
            },
            createdAt: "2024-10-01T12:00:00Z",
            last_login: "2024-10-28T08:30:00Z",
            first_time_deposit: {
              amount: "100.00",
              date_at: "2024-10-05T10:00:00Z",
            },
            first_time_trade: {
              amount: "200.00",
              date_at: "2024-10-06T14:30:00Z",
            },
            accounts: {
              live: 1,
              demo: 0,
              total_deposits_usd: "1000.00",
              total_withdrawals_usd: "500.00",
            },
            flags: {
              kycStatus: "verified",
              emailVerified: true,
              hasDocuments: true,
            },
          },
          {
            readableId: 10002,
            first_name: "Jane",
            last_name: "Smith",
            email: "janesmith@example.com",
            phone: "+1987654321",
            nationality: "GB",
            language: "en",
            country: "UK",
            address: "456 Queen St, London, SW1A 1AA",
            dob: "1990-08-15",
            metadata: {
              deviceType: "iOS",
              utm_source: "facebook",
              utm_medium: "social",
              utm_campaign: "summer_promo",
              language: "en-GB",
            },
            createdAt: "2024-10-02T09:15:00Z",
            last_login: "2024-10-27T11:45:00Z",
            first_time_deposit: {
              amount: "200.00",
              date_at: "2024-10-06T12:00:00Z",
            },
            first_time_trade: {
              amount: "300.00",
              date_at: "2024-10-07T15:20:00Z",
            },
            accounts: {
              live: 2,
              demo: 1,
              total_deposits_usd: "2000.00",
              total_withdrawals_usd: "1000.00",
            },
            flags: {
              kycStatus: "pending",
              emailVerified: false,
              hasDocuments: false,
            },
          },
          {
            readableId: 10001,
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@example.com",
            phone: "+123456789",
            nationality: "US",
            language: "en",
            country: "US",
            address: "123 Main St, Apt 4B, New York, 10001",
            dob: "1985-05-20",
            metadata: {
              deviceType: "android",
              utm_source: "google",
              utm_medium: "cpc",
              utm_campaign: "spring_sale",
              language: "en-US",
            },
            createdAt: "2024-10-01T12:00:00Z",
            last_login: "2024-10-28T08:30:00Z",
            first_time_deposit: {
              amount: "100.00",
              date_at: "2024-10-05T10:00:00Z",
            },
            first_time_trade: {
              amount: "200.00",
              date_at: "2024-10-06T14:30:00Z",
            },
            accounts: {
              live: 1,
              demo: 0,
              total_deposits_usd: "1000.00",
              total_withdrawals_usd: "500.00",
            },
            flags: {
              kycStatus: "verified",
              emailVerified: true,
              hasDocuments: true,
            },
          },
          {
            readableId: 10002,
            first_name: "Jane",
            last_name: "Smith",
            email: "janesmith@example.com",
            phone: "+1987654321",
            nationality: "GB",
            language: "en",
            country: "UK",
            address: "456 Queen St, London, SW1A 1AA",
            dob: "1990-08-15",
            metadata: {
              deviceType: "iOS",
              utm_source: "facebook",
              utm_medium: "social",
              utm_campaign: "summer_promo",
              language: "en-GB",
            },
            createdAt: "2024-10-02T09:15:00Z",
            last_login: "2024-10-27T11:45:00Z",
            first_time_deposit: {
              amount: "200.00",
              date_at: "2024-10-06T12:00:00Z",
            },
            first_time_trade: {
              amount: "300.00",
              date_at: "2024-10-07T15:20:00Z",
            },
            accounts: {
              live: 2,
              demo: 1,
              total_deposits_usd: "2000.00",
              total_withdrawals_usd: "1000.00",
            },
            flags: {
              kycStatus: "pending",
              emailVerified: false,
              hasDocuments: false,
            },
          },
          {
            readableId: 10003,
            first_name: "Carlos",
            last_name: "Gonzalez",
            email: "carlosg@example.com",
            phone: "+34123456789",
            nationality: "ES",
            language: "es",
            country: "ES",
            address: "789 Avenida de España, Madrid, 28001",
            dob: "1988-12-05",
            metadata: {
              deviceType: "windows",
              utm_source: "bing",
              utm_medium: "cpc",
              utm_campaign: "autumn_sale",
              language: "es-ES",
            },
            createdAt: "2024-10-03T14:30:00Z",
            last_login: "2024-10-26T16:00:00Z",
            first_time_deposit: {
              amount: "150.00",
              date_at: "2024-10-07T09:00:00Z",
            },
            first_time_trade: {
              amount: "250.00",
              date_at: "2024-10-08T13:45:00Z",
            },
            accounts: {
              live: 1,
              demo: 2,
              total_deposits_usd: "1500.00",
              total_withdrawals_usd: "700.00",
            },
            flags: {
              kycStatus: "verified",
              emailVerified: true,
              hasDocuments: true,
            },
          },
          {
            readableId: 10004,
            first_name: "Akira",
            last_name: "Tanaka",
            email: "akiratanaka@example.com",
            phone: "+81312345678",
            nationality: "JP",
            language: "ja",
            country: "JP",
            address: "1-1 Chiyoda, Tokyo, 100-0001",
            dob: "1992-03-10",
            metadata: {
              deviceType: "android",
              utm_source: "instagram",
              utm_medium: "social",
              utm_campaign: "winter_promo",
              language: "ja-JP",
            },
            createdAt: "2024-10-04T08:45:00Z",
            last_login: "2024-10-25T07:15:00Z",
            first_time_deposit: null,
            first_time_trade: null,
            accounts: {
              live: 0,
              demo: 1,
              total_deposits_usd: "0.00",
              total_withdrawals_usd: "0.00",
            },
            flags: {
              kycStatus: "notApplied",
              emailVerified: false,
              hasDocuments: false,
            },
          },
          {
            readableId: 10005,
            first_name: "Maria",
            last_name: "Silva",
            email: "mariasilva@example.com",
            phone: "+5511998765432",
            nationality: "BR",
            language: "pt",
            country: "BR",
            address: "Rua das Flores, 123, São Paulo, 01000-000",
            dob: "1987-07-22",
            metadata: {
              deviceType: "iOS",
              utm_source: "twitter",
              utm_medium: "social",
              utm_campaign: "flash_sale",
              language: "pt-BR",
            },
            createdAt: "2024-10-05T11:00:00Z",
            last_login: "2024-10-24T09:30:00Z",
            first_time_deposit: {
              amount: "250.00",
              date_at: "2024-10-08T14:00:00Z",
            },
            first_time_trade: {
              amount: "350.00",
              date_at: "2024-10-09T17:00:00Z",
            },
            accounts: {
              live: 1,
              demo: 0,
              total_deposits_usd: "2500.00",
              total_withdrawals_usd: "1200.00",
            },
            flags: {
              kycStatus: "verified",
              emailVerified: true,
              hasDocuments: true,
            },
          },
        ],
      },
    }
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
