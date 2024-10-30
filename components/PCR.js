import useUser from "../utils/hooks/useUser";
import { PERMISSIONS } from "../config/permissions";

/**
 *
 * @param {[String]} permissionList Required Permissions to view the content
 * @param {Boolean?} matchAllPermissions Match all permissions in the list. Default False
 * @returns
 */
export const usePermissions = (permissionList, matchAllPermissions = false) => {
  const { data } = useUser();
  if (!data) return { permissions: [], isAllowed: false, isAdmin: false };

  const userPerms = [
    ...new Set([
      ...(data.user?.permissions || []),
      ...(data.user?.role?.permissions || []),
    ]),
  ];
  if (data.user?.role?.name === "admin")
    return { permissions: userPerms, isAllowed: true, isAdmin: true };

  let isAllowed = false;

  if (matchAllPermissions) {
    isAllowed = permissionList.every((perm) => userPerms.includes(perm));
  } else {
    isAllowed = permissionList.some((x) => userPerms.includes(x));
  }
  return { permissions: userPerms, isAllowed, isAdmin: false };
};

const Permissions = ({
  permissionList,
  children,
  fallback = null,
  matchAllPermissions = false,
}) => {
  const { permissions, isAllowed, isAdmin } = usePermissions(
    permissionList,
    matchAllPermissions
  );
  return isAllowed ? children : fallback;
};

/**
 *
 * @param {[String]} permissionList Required Permissions to view the content
 * @param {Boolean} matchAllPermissions Match all permissions in the list. Default False
 * @returns
 */
const parsePCR = (permissionList, matchAllPermissions = false) =>
  function PermissionsConditionalRendering({ children, fallback = null }) {
    return (
      <Permissions
        permissionList={permissionList}
        matchAllPermissions={matchAllPermissions}
        fallback={fallback}
      >
        {children}
      </Permissions>
    );
  };

const PCR = {
  // test - example
  export: ({ children }) => (
    <Permissions permissionList={["utils.export"]}>{children}</Permissions>
  ),
  //----------Dashboard----------//
  usersPerCountry: parsePCR([
    PERMISSIONS.DEMOGRAPHICS.get_users_per_country.value,
  ]),
  usersPerDevice: parsePCR([
    PERMISSIONS.DEMOGRAPHICS.get_users_per_device.value,
  ]),
  usersPerTimeframe: parsePCR([
    PERMISSIONS.DEMOGRAPHICS.get_users_per_timeframe.value,
  ]),
  usersTransactionsPerMonth: parsePCR([
    PERMISSIONS.DEMOGRAPHICS.get_transactions_per_month.value,
  ]),
  //----------CRM Users----------//
  getCrmUsers: parsePCR([PERMISSIONS.CRM_USERS.get_crm_users.value]),
  createCrmUser: parsePCR([PERMISSIONS.CRM_USERS.create_crm_user.value]),
  updateCrmUser: parsePCR([PERMISSIONS.CRM_USERS.update_crm_user.value]),
  deleteCrmUser: parsePCR([PERMISSIONS.CRM_USERS.delete_crm_user.value]),
  updateCrmUserPermissions: parsePCR(
    [
      PERMISSIONS.CRM_USERS.add_crm_user_permissions.value,
      PERMISSIONS.CRM_USERS.remove_crm_user_permissions.value,
    ],
    true
  ),
  updateCrmUserSalesCountries: parsePCR(
    [
      PERMISSIONS.CRM_USERS.add_crm_user_sales_countries.value,
      PERMISSIONS.CRM_USERS.remove_crm_user_sales_countries.value,
    ],
    true
  ),
  //----------Trades----------//
  viewPositions: parsePCR([PERMISSIONS.TRADES.view_positions.value]),
  viewOrders: parsePCR([PERMISSIONS.TRADES.view_orders.value]),
  viewDeals: parsePCR([PERMISSIONS.TRADES.view_deals.value]),
  //----------User Segments----------//
  viewUserSegments: parsePCR([
    PERMISSIONS.USER_SEGMENTS.view_user_segments.value,
  ]),
  createUserSegment: parsePCR([
    PERMISSIONS.USER_SEGMENTS.create_user_segments.value,
  ]),
  updateUserSegment: parsePCR([
    PERMISSIONS.USER_SEGMENTS.update_user_segments.value,
  ]),
  deleteUserSegment: parsePCR([
    PERMISSIONS.USER_SEGMENTS.delete_user_segments.value,
  ]),
  viewSegmentResults: parsePCR([
    PERMISSIONS.USER_SEGMENTS.view_user_segment_results.value,
  ]),
  //----------Ribbons----------//
  viewRibbons: parsePCR([PERMISSIONS.RIBBONS.view_ribbons.value]),
  createRibbon: parsePCR([PERMISSIONS.RIBBONS.create_ribbons.value]),
  updateRibbon: parsePCR([PERMISSIONS.RIBBONS.update_ribbons.value]),
  //----------Financial Notes----------//
  viewFinancialNotes: parsePCR([
    PERMISSIONS.FINANCIAL_NOTES.view_financial_notes.value,
  ]),
  createFinancialNote: parsePCR([
    PERMISSIONS.FINANCIAL_NOTES.create_financial_note.value,
  ]),
  updateFinancialNote: parsePCR([
    PERMISSIONS.FINANCIAL_NOTES.update_financial_note.value,
  ]),
  deleteFinancialNote: parsePCR([
    PERMISSIONS.FINANCIAL_NOTES.delete_financial_note.value,
  ]),
  //----------Notes----------//
  viewNotes: parsePCR([PERMISSIONS.NOTES.view_notes.value]),
  createNote: parsePCR([PERMISSIONS.NOTES.create_note.value]),
  updateNote: parsePCR([PERMISSIONS.NOTES.update_note.value]),
  deleteNote: parsePCR([PERMISSIONS.NOTES.delete_note.value]),
  //----------Transactions----------//
  //temp??
  viewTransactions: parsePCR([
    PERMISSIONS.TRANSACTIONS.view_transactions.value,
  ]),
  exportTransactions: parsePCR([
    PERMISSIONS.TRANSACTIONS.export_transactions.value,
  ]),
  //----------Requests----------//
  //temp??
  viewRequests: parsePCR([PERMISSIONS.REQUESTS.view_requests.value]),
  viewPendingWithdrawals: parsePCR([
    PERMISSIONS.REQUESTS.view_pending_withdrawals.value,
  ]),
  deleteAccount: parsePCR([PERMISSIONS.REQUESTS.delete_account.value]),
  updateAccount: parsePCR([PERMISSIONS.ACCOUNTS.update_account.value]),
  transferOperations: parsePCR([PERMISSIONS.ACCOUNTS.transfer_opration.value]),
  withdrawFromAccountStatus: parsePCR([
    PERMISSIONS.REQUESTS.withdraw_from_account_status.value,
  ]),
  withdrawFromAccount: parsePCR([
    PERMISSIONS.REQUESTS.withdraw_from_account.value,
  ]),
  cryptoDeposit: parsePCR([PERMISSIONS.REQUESTS.crypto_deposit.value]),
  //----------Documents----------//
  viewDocuments: parsePCR([PERMISSIONS.DOCUMENTS.view_documents.value]),
  viewDocumentPerId: parsePCR([
    PERMISSIONS.DOCUMENTS.view_document_per_id.value,
  ]),
  viewUserDocuments: parsePCR([
    PERMISSIONS.DOCUMENTS.view_user_documents.value,
  ]),
  updateDocument: parsePCR([PERMISSIONS.DOCUMENTS.update_document.value]),
  deleteDocument: parsePCR([PERMISSIONS.DOCUMENTS.delete_document.value]),
  uploadUserDocuments: parsePCR([
    PERMISSIONS.DOCUMENTS.upload_user_documents.value,
  ]),
  forceChangeKycStatus: parsePCR([
    PERMISSIONS.DOCUMENTS.force_change_kyc_status.value,
  ]),
  //----------Accounts----------//
  getAccountPerId: parsePCR([PERMISSIONS.ACCOUNTS.per_account_id.value]),
  deleteAccount: parsePCR([PERMISSIONS.ACCOUNTS.delete_account.value]),
  //----------Users----------//
  userLogs: parsePCR([PERMISSIONS.USERS.logs.value]),
  updateUser: parsePCR([PERMISSIONS.USERS.update_user.value]),
  viewUserExtraDetails: parsePCR([
    PERMISSIONS.USERS.view_user_extra_details.value,
  ]),
  balanceOperation: parsePCR([PERMISSIONS.ACCOUNTS.balance_operation.value]),
  changeSalesAssignment: parsePCR([
    PERMISSIONS.USERS.change_sales_assignment.value,
  ]),
  viewFollowups: parsePCR([PERMISSIONS.USERS.view_followups.value]),
  isAdmin: parsePCR([], false),
  suspendUser: parsePCR([PERMISSIONS.USERS.suspend_user.value]),
};

export default PCR;
