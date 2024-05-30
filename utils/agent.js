import { getCookie, setCookie } from "cookies-next";
import _ from "lodash";
import { getInstance } from "./axiosProvider";
import { formatFilters, pruneNullOrUndefinedFields } from "./functions";
import { USER_TRANSACTION_TYPES } from "../config/enums";
import { chunkStrings } from "./helpers";

export const getJWTToken = () => {
  const tokenLength = getCookie("tiocrm_token_length");
  let token = "";
  for (let i = 0; i < Number(tokenLength); i++) {
    token += getCookie(`tiocrm_token_${i}`);
  }
  return token;
};

const removeJWTToken = () => {
  const tokenLength = Number(getCookie("tiocrm_token_length"));
  if (tokenLength === NaN) return;
  for (let i = 0; i < tokenLength; i++) {
    setCookie(`tiocrm_token_${i}`, "", { sameSite: "lax" });
  }
  setCookie("tiocrm_token_length", "", { sameSite: "lax" });
};

export const setJWTToken = (token) => {
  removeJWTToken();
  const chunks = chunkStrings(token, 2000);
  setCookie("tiocrm_token_length", chunks.length, { sameSite: "lax" });
  chunks.forEach((chunk, i) => {
    setCookie(`tiocrm_token_${i}`, chunk, { sameSite: "lax" });
  });
};
const setRefreshToken = (token) => {
  setCookie("refresh_token", token, { sameSite: "lax" });
};

const removeTokens = () => {
  window.localStorage.removeItem("user");
  setJWTToken("");
  setCookie("refresh_token", "", { sameSite: "lax" });
};

const saveCurrentUser = (user) => {
  window.localStorage.setItem("user", JSON.stringify(user));
};

/**
 * @return {{
 *  instance: import("axios").AxiosInstance;
 *  refreshAccessToken: () => Promise<void>;
 * }}
 */
function createServerOrClientAxios(context) {
  if (context) {
    const token = getJWTToken("token", context);
    const refresh_token = getCookie("refresh_token", context);
    const brand = getCookie("crmBrand", context);
    return getInstance(token, refresh_token, brand, (token) => {
      context.res.setHeader("Set-Cookie", [
        `token=${token}; sameSite=lax; path=/;`,
      ]);
    });
  } else {
    const token = getJWTToken("token");
    const refresh_token = getCookie("refresh_token");
    const brand = getCookie("crmBrand");
    return getInstance(token, refresh_token, brand, setJWTToken);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (context) {
  let { instance: axiosInstance, refreshAccessToken } =
    createServerOrClientAxios(context);
  let brand = getCookie("crmBrand", context);
  return {
    axiosInstance,
    refreshAccessToken,
    loginCrmUser: async (email, password) => {
      let res = await axiosInstance.post("/dashboard/auth/login", {
        email,
        password,
      });
      setRefreshToken(res.data.refresh_token);
      setJWTToken(res.data.token);
      saveCurrentUser(res.data.user);
      return res.data;
    },
    loginAsAnotherCrmUser: async (crmuser_id) => {
      const res = await axiosInstance
        .post(
          "/dashboard/auth/loginAs",
          {
            crmuser_id,
          },
          {
            params: {
              brand,
            },
          }
        )
        .then((res) => res.data);
      let originalRtoken = getCookie("refresh_token");
      setCookie("loggedInAs", "true", { sameSite: "lax" });
      setCookie(
        "loggedinuser",
        `${res.user.first_name} ${res.user.last_name}`,
        { sameSite: "lax" }
      );
      setCookie("original_user_refresh_token", originalRtoken, {
        sameSite: "lax",
      });
      setRefreshToken(res.refresh_token);
      setJWTToken(res.token);
      saveCurrentUser(res.user);
      return res;
    },
    getAllClients: async ({
      page = 1,
      limit = 50,
      sort,
      search,
      filters,
      fields,
      exportType,
    }) => {
      return axiosInstance.get("/dashboard/users", {
        params: {
          page,
          limit,
          sort,
          search: search && search !== "" ? search : null,
          filters,
          fields: exportType ? fields : null,
          export: exportType,
          brand,
        },
      });
    },
    searchClients: async (search) => {
      return axiosInstance
        .get("/dashboard/users", {
          params: { search, limit: 5, brand },
        })
        .then((res) => res.data.docs);
    },
    logOutCrmUser: async () => {
      return axiosInstance
        .post("/dashboard/auth/logout")
        .finally(() => removeTokens());
    },
    getClientById: async (userId) => {
      return axiosInstance.get(`/dashboard/users/${userId}`, {
        params: { brand },
      });
    },
    getClientKycDocuments: async (userId) => {
      return axiosInstance.get(`/dashboard/users/${userId}/documents`, {
        params: { brand },
      });
    },
    uploadClientKycDocument: async (userId, body) => {
      return axiosInstance.post(`/dashboard/users/${userId}/documents`, body, {
        params: { brand },
      });
    },
    createNote: async (userId, note) => {
      return axiosInstance.post(
        `/dashboard/users/${userId}/notes`,
        { note },
        {
          params: { brand },
        }
      );
    },
    getAllNotes: async (userId, page = 1, limit = 50) => {
      return axiosInstance.get(`/dashboard/users/${userId}/notes`, {
        params: { page, limit, brand },
      });
    },
    deleteNote: async (userId, noteId) => {
      return axiosInstance.delete(
        `/dashboard/users/${userId}/notes/${noteId}`,
        {
          params: { brand },
        }
      );
    },
    editNote: async (userId, noteId, note, isPinned) => {
      return axiosInstance.put(
        `/dashboard/users/${userId}/notes/${noteId}`,
        {
          note,
          isPinned,
        },
        {
          params: { brand },
        }
      );
    },
    createFinancialNote: async (userId, note) => {
      return axiosInstance.post(
        `/dashboard/users/${userId}/financialnotes`,
        {
          note,
        },
        {
          params: { brand },
        }
      );
    },
    getAllFinancialNotes: async (userId, page = 1, limit = 50) => {
      return axiosInstance.get(`/dashboard/users/${userId}/financialnotes`, {
        params: { page, limit, brand },
      });
    },
    deleteFinancialNote: async (userId, noteId) => {
      return axiosInstance.delete(
        `/dashboard/users/${userId}/financialnotes/${noteId}`,
        {
          params: { brand },
        }
      );
    },
    editFinancialNote: async (userId, noteId, note) => {
      return axiosInstance.put(
        `/dashboard/users/${userId}/financialnotes/${noteId}`,
        { note },
        {
          params: { brand },
        }
      );
    },
    getActiveTraders: async ({ page, limit, exportType }) => {
      return axiosInstance.get(`/dashboard/users/activeTraders`, {
        params: {
          page,
          limit,
          brand,
          ...(exportType ? { export: exportType } : {}),
        },
      });
    },
    getAllClientsDocuments: async ({ page = 1, limit = 50, status, sort }) => {
      return axiosInstance.get(`/dashboard/users/documents`, {
        params: { page, limit, status, sort, brand },
      });
    },
    acceptUserDocument: async (documentId) => {
      return axiosInstance.put(
        `/dashboard/users/documents/${documentId}?status=approved`,
        {},
        {
          params: { brand },
        }
      );
    },
    rejectUserDocument: async (documentId) => {
      return axiosInstance.put(
        `/dashboard/users/documents/${documentId}?status=rejected`,
        {},
        { params: { brand } }
      );
    },
    pendingChangeUserDocument: async (documentId) => {
      return axiosInstance.put(
        `/dashboard/users/documents/${documentId}?status=pendingChanges`,
        {},
        { params: { brand } }
      );
    },
    deleteDocument: async (documentId) => {
      return axiosInstance.delete(`/dashboard/users/documents/${documentId}`, {
        params: { brand },
      });
    },
    getAllCrmUsers: async (page = 1, limit = 50, sort, department) => {
      return axiosInstance.get("/dashboard/crmusers", {
        params: { page, limit, sort, department, brand },
      });
    },
    createCrmUser: async (user) => {
      return axiosInstance.post("/dashboard/crmusers", user, {
        params: { brand },
      });
    },
    deleteCrmUser: async (userId) => {
      return axiosInstance.delete(`/dashboard/crmusers/${userId}`, {
        params: { brand },
      });
    },
    editCrmUser: async (userId, user) => {
      return axiosInstance.patch(`/dashboard/crmusers/${userId}`, user, {
        params: { brand },
      });
    },
    getAllClientAccounts: async (
      environment = "live",
      page = 1,
      limit = 50
    ) => {
      return axiosInstance.get("/dashboard/users/accounts", {
        params: { page, limit, environment_type: environment, brand },
      });
    },
    getClientAccounts: async (
      userId,
      environment = "live",
      page = 1,
      limit = 50
    ) => {
      return axiosInstance.get("/dashboard/users/accounts", {
        params: {
          page,
          limit,
          environment_type: environment,
          user: userId,
          brand,
        },
      });
    },
    getClientAccount: async (accountId) => {
      return axiosInstance.get(`/dashboard/users/accounts/${accountId}`, {
        params: { brand },
      });
    },
    updateClientAccount: async (accountId, leverage, account_type) => {
      return axiosInstance.put(
        `/dashboard/users/accounts/${accountId}`,
        {
          leverage,
          account_type,
        },
        {
          params: { brand },
        }
      );
    },
    deleteClientAccount: async (accountId) => {
      return axiosInstance.delete(`/dashboard/users/accounts/${accountId}`, {
        params: { brand },
      });
    },
    getDocumentById: async (documentId) => {
      return axiosInstance.get(`/dashboard/users/documents/${documentId}`, {
        params: { brand },
      });
    },
    getClientsRequests: async (
      page = 1,
      limit = 50,
      request_type,
      user_id,
      status,
      sort
    ) => {
      return axiosInstance.get("/dashboard/users/requests", {
        params: {
          page,
          limit,
          filters: formatFilters({
            request_type,
            user_id,
            status,
          }),
          sort,
          brand,
        },
      });
    },
    getPendingRequests: async ({
      page = 1,
      limit = 50,
      sort,
      filters,
      fields,
      exportType,
    }) => {
      return axiosInstance.get("/dashboard/users/requests", {
        params: {
          page,
          limit,
          filters:
            "request_type[ne]:withdrawFromAccount|depositCryptoToAccount,status:pending" +
            (!filters ? "" : `,${filters}`),
          sort,
          fields: exportType ? fields : undefined,
          export: exportType,
          brand,
        },
      });
    },
    getPendingWithdrawals: async ({
      page = 1,
      limit = 50,
      sort,
      filters,
      fields,
      exportType,
    }) => {
      return axiosInstance.get("/dashboard/users/requests", {
        params: {
          page,
          limit,
          filters:
            "request_type:withdrawFromAccount,status[ne]:processed|reject" +
            (!filters ? "" : `,${filters}`),
          sort,
          fields: exportType ? fields : undefined,
          export: exportType,
          brand,
        },
      });
    },
    getPendingDeposits: async ({
      page = 1,
      limit = 50,
      sort,
      filters,
      fields,
      exportType,
    }) => {
      return axiosInstance.get("/dashboard/users/requests", {
        params: {
          page,
          limit,
          filters:
            "request_type:depositCryptoToAccount,status[ne]:processed|reject" +
            (!filters ? "" : `,${filters}`),
          sort,
          fields: exportType ? fields : undefined,
          export: exportType,
          brand,
        },
      });
    },
    updateClientRequest: async (
      requestId,
      action,
      reject_reason = null,
      delayed_reason = null,
      methods = null,
      fee = null
    ) => {
      return axiosInstance.post(
        `/dashboard/users/requests/${requestId}/${action}`,
        pruneNullOrUndefinedFields({
          reject_reason,
          delayed_reason,
          methods,
          fee,
        }),
        {
          params: { brand },
        }
      );
    },
    getUserLogs: async (user_id, page = 1, limit = 50, filters) => {
      return axiosInstance.get(`/dashboard/users/${user_id}/logs`, {
        params: { page, limit, brand, filters },
      });
    },
    editClient: async (userId, user) => {
      return axiosInstance.put(`/dashboard/users/${userId}`, user, {
        params: { brand },
      });
    },
    editPhone: async (userId, phone) => {
      return axiosInstance.put(
        `/dashboard/users/${userId}/changephone`,
        phone,
        { params: { brand } }
      );
    },
    getClientByCtid: async (ctid) => {
      return axiosInstance.get(`/dashboard/users/ctid/${ctid}`, {
        params: { brand },
      });
    },
    getTransactions: async (
      page = 1,
      limit = 50,
      user_id,
      transaction_type,
      status,
      sort,
      filters
    ) => {
      let filterString =
        formatFilters({
          transaction_type,
          user_id,
          status,
        }) + (!filters ? "" : `,${filters}`);
      if (filterString.startsWith(",")) {
        filterString = filterString.substring(1);
      }
      return axiosInstance.get("/dashboard/users/transactions", {
        params: {
          page,
          limit,
          filters: !_.isEmpty(filterString) ? filterString : null,
          sort,
          brand,
        },
      });
    },
    getFirstTimeDeposits: async ({ page = 1, limit = 50, sort, filters }) => {
      return axiosInstance.get(
        `/dashboard/users/transactions/firstTimeDeposits`,
        {
          params: { page, limit, brand, sort, filters },
        }
      );
    },
    getDeposits: async ({
      page = 1,
      limit = 50,
      sort,
      filters,
      fields,
      exportType,
    }) => {
      return axiosInstance.get("/dashboard/users/transactions", {
        params: {
          page,
          limit,
          sort,
          filters:
            `transaction_type:${[
              USER_TRANSACTION_TYPES.deposit,
              USER_TRANSACTION_TYPES.balance_operation_deposit,
            ].join("|")},status[ne]:pending` + (!filters ? "" : `,${filters}`),
          fields: exportType ? fields : undefined,
          export: exportType,
          brand,
        },
      });
    },
    getWithdrawals: async ({
      page = 1,
      limit = 50,
      sort,
      filters,
      fields,
      exportType,
    }) => {
      return axiosInstance.get("/dashboard/users/transactions", {
        params: {
          page,
          limit,
          sort,
          filters:
            `transaction_type:${[
              USER_TRANSACTION_TYPES.withdrawal,
              USER_TRANSACTION_TYPES.balance_operation_withdrawal,
            ].join("|")},status[ne]:pending` + (!filters ? "" : `,${filters}`),
          fields: exportType ? fields : undefined,
          export: exportType,
          brand,
        },
      });
    },
    getUsersPerDevice: async () => {
      return axiosInstance.get("/dashboard/demographics/usersPerDevice", {
        params: {
          brand,
        },
      });
    },
    getUsersPerCountry: async () => {
      return axiosInstance.get("/dashboard/demographics/usersPerCountry", {
        params: {
          brand,
        },
      });
    },
    getUsersPerTimeframe: async () => {
      return axiosInstance.get(`/dashboard/demographics/usersPerTimeframe`, {
        params: {
          brand,
        },
      });
    },
    getDailyTransactionsForThisMonth: async () => {
      return axiosInstance.get("/dashboard/demographics/dailyTransactions", {
        params: {
          brand,
        },
      });
    },
    getClientsCSV: async (fields = {}, filters = {}) => {
      return axiosInstance.post(
        "/dashboard/users/exports",
        {
          fields,
          filters,
        },
        {
          params: { brand },
        }
      );
    },
    getTransactionsCSV: async (fields = {}, filters = {}) => {
      return axiosInstance.post(
        "/dashboard/users/transactions/exports",
        {
          fields,
          filters: `fromDate:${filters.fromDate},toDate:${filters.toDate}`,
        },
        {
          params: { brand },
        }
      );
    },
    addSaleCountriesRotation: async (saleAgentId, sales_rotation_countries) => {
      return axiosInstance.patch(
        `/dashboard/crmusers/${saleAgentId}/salescountries`,
        { sales_rotation_countries },
        {
          params: { brand },
        }
      );
    },
    deleteSaleCountriesRotation: async (
      saleAgentId,
      sales_rotation_countries
    ) => {
      return axiosInstance.delete(
        `/dashboard/crmusers/${saleAgentId}/salescountries`,
        { data: { sales_rotation_countries }, params: { brand } }
      );
    },
    getAvailablePermissions: async () => {
      return axiosInstance.get("/dashboard/permissions");
    },
    getCurrentCrmUser: async () => {
      return axiosInstance.get("/dashboard/crmusers/current", {
        params: { brand },
      });
    },
    getLatestTransactions: async () => {
      return axiosInstance.get(
        "/dashboard/users/transactions?page=1&limit=10&sort=createdAt:desc&filters=transaction_type[ne]:transfer_between_accounts",
        {
          params: { brand },
        }
      );
    },
    addPermissionToCrmUser: async (crmUserId, permissions) => {
      return axiosInstance.patch(
        `/dashboard/crmusers/${crmUserId}/permissions`,
        { permissions },
        {
          params: { brand },
        }
      );
    },
    removePermissionFromCrmUser: async (crmUserId, permissions) => {
      return axiosInstance.delete(
        `/dashboard/crmusers/${crmUserId}/permissions`,
        { data: { permissions }, params: { brand } }
      );
    },
    createPermissionsRole: async (name, permissions) => {
      return axiosInstance.post(
        "/dashboard/roles",
        { name, permissions },
        {
          params: {
            brand,
          },
        }
      );
    },
    getAllRoles: async () => {
      return axiosInstance.get("/dashboard/roles", {
        params: {
          brand,
        },
      });
    },
    getClientExtraDetails: async (userId) => {
      return axiosInstance.get(`/dashboard/users/${userId}/extradetails`, {
        params: {
          brand,
        },
      });
    },
    deleteRole: async (roleId) => {
      return axiosInstance.delete(`/dashboard/roles/${roleId}`, {
        params: {
          brand,
        },
      });
    },
    updateClientSalesAgent: async (user_id, sales_agent_id) => {
      return axiosInstance.put(
        `/dashboard/users/${user_id}/changeSalesAgent`,
        {
          sales_agent_id,
        },
        {
          params: { brand },
        }
      );
    },
    addPermissionsToRole: async (roleId, permissions) => {
      return axiosInstance.patch(
        `/dashboard/roles/${roleId}/permissions`,
        {
          permissions,
        },
        {
          params: {
            brand,
          },
        }
      );
    },
    removePermissionsFromRole: async (roleId, permissions) => {
      return axiosInstance.delete(`/dashboard/roles/${roleId}/permissions`, {
        data: { permissions },
        params: { brand },
      });
    },
    setKycStatus: async (userId, status) => {
      return axiosInstance.patch(
        `/dashboard/users/${userId}/documents/kyc`,
        {
          status,
        },
        {
          params: { brand },
        }
      );
    },
    getPositions: async (
      page = 1,
      limit = 50,
      filters,
      fields,
      sort,
      exports
    ) => {
      return axiosInstance.get("/dashboard/users/trades/positions", {
        params: {
          page,
          limit,
          filters: formatFilters(filters),
          fields,
          sort,
          export: exports,
          brand,
        },
      });
    },
    getAccountOpenTrades: async ({ accountId, page = 1, limit = 50 }) => {
      return axiosInstance.get(
        `/dashboard/users/accounts/${accountId}/trades`,
        {
          params: {
            page,
            limit,
            type: "open",
            brand,
          },
        }
      );
    },
    getAccountClosedTrades: async ({ accountId, page = 1, limit = 50 }) => {
      return axiosInstance.get(
        `/dashboard/users/accounts/${accountId}/trades`,
        {
          params: {
            page,
            limit,
            type: "closed",
            brand,
          },
        }
      );
    },
    createSegment: async (name, filters) => {
      return axiosInstance.post(
        "/dashboard/users/segments",
        { name, filters },
        {
          params: { brand },
        }
      );
    },
    updateSegment: async (segmentId, name, filters) => {
      return axiosInstance.put(
        `/dashboard/users/segments/${segmentId}`,
        {
          name,
          filters,
        },
        {
          params: { brand },
        }
      );
    },
    getAllSegments: async () => {
      return axiosInstance.get("/dashboard/users/segments", {
        params: { brand },
      });
    },
    getClientsBySegment: async (segmentId, page = 1, limit = 50) => {
      return axiosInstance.get(`/dashboard/users/segments/${segmentId}`, {
        params: { page, limit, brand },
      });
    },
    createRibbon: async (ribbon) => {
      return axiosInstance.post(`/dashboard/users/ribbons`, ribbon, {
        params: { brand },
      });
    },
    /**
     * @param {"client"|"segments"} type
     * @param {String} id
     */
    getAllRibbons: async (type, id) => {
      return axiosInstance
        .get(`/dashboard/users/ribbons`, {
          params: {
            [type === "client" ? "user_id" : "segment_id"]: id,
            brand,
          },
        })
        .then((res) => res.data);
    },
    editRibbon: async (ribbonId, ribbon) => {
      return axiosInstance.put(`/dashboard/users/ribbons/${ribbonId}`, ribbon, {
        params: { brand },
      });
    },
    getAllTransactions: async ({
      page = 1,
      limit = 50,
      sort,
      search,
      filters,
      fields,
      exportType,
    }) => {
      return axiosInstance.get("/dashboard/users/transactions", {
        params: {
          page,
          limit,
          sort: "updatedAt:desc",
          search: search && search !== "" ? search : null,
          filters,
          fields: exportType ? fields : null,
          export: exportType,
          brand,
        },
      });
    },
    updateBalance: async (accountId, balance) => {
      return axiosInstance.post(
        `/dashboard/users/accounts/${accountId}/balanceOperation`,
        balance,
        {
          params: { brand },
        }
      );
    },
    transferBetweenAccounts: async ({
      amount,
      accountFrom,
      accountTo,
      reason,
    }) => {
      return axiosInstance.post(
        "/dashboard/users/accounts/transferFunds",
        {
          amount,
          accountFrom,
          accountTo,
          reason,
        },
        {
          params: {
            brand,
          },
        }
      );
    },
    updateCredit: async (accountId, balance) => {
      return axiosInstance.post(
        `/dashboard/users/accounts/${accountId}/creditOperation`,
        balance,
        {
          params: { brand },
        }
      );
    },
    getExchangeRates: async ({ from, to }) => {
      return axiosInstance.get("/dashboard/utils/exchangeRate", {
        params: {
          from,
          to,
        },
      });
    },
    searchClientsByField: async (field, searchText) => {
      return axiosInstance.get(`/dashboard/users/search`, {
        params: {
          field,
          searchText,
          brand,
        },
      });
    },
    getClientsRequestById: async (requestId) => {
      return axiosInstance.get(`/dashboard/users/requests/${requestId}`, {
        params: {
          brand,
        },
      });
    },
    getOtherCrmUsers: async ({ page, limit = 1000 }) => {
      return axiosInstance.get("/dashboard/crmusers/all", {
        params: {
          page,
          limit,
          brand,
        },
      });
    },
    copyCrmUser: async ({ crmuserId, otherBrand }) => {
      return axiosInstance.post(
        `/dashboard/crmusers/copy`,
        { crmuserId, otherBrand },
        {
          params: {
            brand,
          },
        }
      );
    },
    updateCrmUserWhitelistCountries: async (
      crmuserId,
      { enable_country_whitelist, whitelist_countries }
    ) => {
      return axiosInstance.put(
        `/dashboard/crmusers/${crmuserId}/countryWhitelist`,
        {
          enable_country_whitelist,
          whitelist_countries,
        },
        {
          params: {
            brand,
          },
        }
      );
    },
    getLogsByType: async (type, cursor, limit = 50) => {
      return axiosInstance.get(`/dashboard/users/userLogs`, {
        params: {
          cursor,
          limit,
          brand,
          type,
        },
      });
    },
    checkIsAllowedToChangeEmail: async (userId) => {
      return axiosInstance.get(`/dashboard/users/${userId}/changeEmail`, {
        params: {
          brand,
        },
      });
    },
    changeClientEmail: async (userId, email) => {
      return axiosInstance.put(
        `/dashboard/users/${userId}/changeEmail`,
        {
          email,
        },
        {
          params: {
            brand,
          },
        }
      );
    },
    updateAccountPermissions: async (accountId, permissions) => {
      return axiosInstance.put(
        `/dashboard/users/accounts/${accountId}/permissions`,
        permissions,
        {
          params: {
            brand,
          },
        }
      );
    },
    getSalesAgents: async () => {
      return axiosInstance.get("/dashboard/crmusers/salesagents", {
        params: {
          brand,
        },
      });
    },
    getUserAccountTypes: async ({ user_id, environment_type = "live" }) => {
      return axiosInstance.get(`/dashboard/users/${user_id}/accountTypes`, {
        params: {
          environment_type,
          brand,
        },
      });
    },
    updateUserUtms: async (userId, utms) => {
      return axiosInstance.put(`/dashboard/users/${userId}/utms`, utms, {
        params: {
          brand,
        },
      });
    },
    getUserCalendarEvents: async ({ user_id, start, end }) => {
      return axiosInstance.get(`/dashboard/calendarEvents`, {
        params: {
          brand,
          user_id,
          start,
          end,
        },
      });
    },
    addUserCalendarEvents: async ({
      type,
      startDate,
      endDate,
      client,
      selectedBrand,
      title,
    }) => {
      return axiosInstance.post(
        `/dashboard/calendarEvents`,
        {
          start: startDate,
          end: endDate,
          title,
          eventType: type,
        },
        {
          params: { brand: selectedBrand, user_id: client._id },
        }
      );
    },
    updadeCalendarEventStatus: async ({ event, status, selectedBrand }) => {
      return axiosInstance.put(
        `/dashboard/calendarEvents/${event}`,
        {
          completed: status,
        },
        {
          params: {
            brand: selectedBrand,
          },
        }
      );
    },
    updateRefundAmount: async (transaction_id, refundAmount) => {
      return axiosInstance.put(
        `/dashboard/users/transactions/${transaction_id}`,
        {
          refundAmount,
        },
        {
          params: {
            brand,
          },
        }
      );
    },
    getBalanceReport: async ({ exportType }) => {
      return axiosInstance.get(`/dashboard/users/balanceReport`, {
        params: {
          brand,
          ...(exportType ? { export: exportType } : {}),
        },
      });
    },
    suspendUser: async (userId) => {
      return axiosInstance.put(
        `/dashboard/users/${userId}/suspend`,
        {
          suspend: true,
        },
        {
          params: {
            brand,
          },
        }
      );
    },
    unsuspendUser: async (userId) => {
      return axiosInstance.put(
        `/dashboard/users/${userId}/suspend`,
        {
          suspend: false,
        },
        {
          params: {
            brand,
          },
        }
      );
    },
  };
}
