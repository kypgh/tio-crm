export const PERMISSIONS = Object.freeze({
  USERS: {
    logs: {
      value: "users.logs",
      label: "View User Logs",
      description: "Permission to view user logs",
    },
    get_user: {
      value: "users.get_user",
      label: "Get User Information",
      description: "Permission to get user information",
    },
    get_users: {
      value: "users.get_users",
      label: "Get List of Users",
      description: "Permission to get a list of users",
    },
    update_user: {
      value: "users.update_user",
      label: "Update User Information",
      description: "Permission to update user information",
    },
    view_user_extra_details: {
      value: "users.view_user_extra_details",
      label: "View User Extra Details",
      description: "Permission to view extra details for a user",
    },
    change_sales_assignment: {
      value: "users.change_sales_assignment",
      label: "Change Sales Assignment",
      description: "Permission to change sales assignment",
    },
    update_utms: {
      value: "users.update_utms",
      label: "Update UTMs",
      description: "Permission to update UTMs",
    },
    view_followups: {
      value: "users.view_followups",
      label: "View Follow ups ",
      description: "Permission to view Follow ups",
    },
    refund_transaction: {
      value: "users.refund_transaction",
      label: "Refund Transaction",
      description: "Permission to refund transactions",
    },
    suspend_user: {
      value: "users.suspend_user",
      label: "Suspend User",
      description: "Permission to suspend user",
    },
  },
  ACCOUNTS: {
    get_accounts: {
      value: "accounts.get_accounts",
      label: "Get Accounts",
      description: "Permission to get accounts",
    },
    per_account_id: {
      value: "accounts.per_account_id",
      label: "Get Account by ID",
      description: "Permission to get account by ID",
    },
    update_account: {
      value: "accounts.update_account",
      label: "Update Account",
      description: "Permission to update account",
    },
    delete_account: {
      value: "accounts.delete_account",
      label: "Delete Account",
      description: "Permission to delete account",
    },
    balance_operation: {
      value: "accounts.balance_operation",
      label: "Balance Operation",
      description: "Permission for balance operations",
    },
    view_trades: {
      value: "accounts.view_trades",
      label: "View Trades",
      description: "Permission to view trades",
    },
    transfer_opration: {
      value: "accounts.transfer_opration",
      label: "Transfer Operation",
      description: "Permission for transfer operations",
    },
  },
  DOCUMENTS: {
    view_documents: {
      value: "documents.view_documents",
      label: "View Documents",
      description: "Permission to view documents",
    },
    view_document_per_id: {
      value: "documents.view_document_per_id",
      label: "View Document by ID",
      description: "Permission to view a document by ID",
    },
    view_user_documents: {
      value: "documents.view_user_documents",
      label: "View User Documents",
      description: "Permission to view documents for a user",
    },
    per_document_id: {
      value: "documents.per_document_id",
      label: "Get Document by ID",
      description: "Permission to get a document by ID",
    },
    update_document: {
      value: "documents.update_document",
      label: "Update Document",
      description: "Permission to update a document",
    },
    delete_document: {
      value: "documents.delete_document",
      label: "Delete Document",
      description: "Permission to delete a document",
    },
    upload_user_documents: {
      value: "documents.upload_user_documents",
      label: "Upload User Documents",
      description: "Permission to upload documents for a user",
    },
    force_change_kyc_status: {
      value: "documents.force_change_kyc_status",
      label: "Force Change KYC Status",
      description: "Permission to force change KYC status",
    },
  },
  UTILS: {
    export: {
      value: "utils.export",
      label: "Export Data",
      description: "Permission to export data",
    },
  },
  REQUESTS: {
    view_requests: {
      value: "requests.view_requests",
      label: "View Requests",
      description: "Permission to view requests",
    },
    view_pending_withdrawals: {
      value: "requests.view_pending_withdrawals",
      label: "View Pending Withdrawals",
      description: "Permission to view pending withdrawals",
    },
    view_pending_deposits: {
      value: "requests.view_pending_deposits",
      label: "View Pending Deposits",
      description: "Permission to view pending deposits",
    },
    delete_account: {
      value: "requests.delete_account",
      label: "Delete Account Request",
      description: "Permission to delete an account request",
    },
    withdraw_from_account_status: {
      value: "requests.withdraw_from_account_status",
      label: "Withdraw from Account Status",
      description: "Permission for withdrawal status from an account",
    },
    withdraw_from_account: {
      value: "requests.withdraw_from_account",
      label: "Withdraw from Account",
      description: "Permission to withdraw from an account",
    },
    crypto_deposit: {
      value: "requests.crypto_deposit",
      label: "Crypto Deposit",
      description: "Permission for crypto deposits",
    },
    transfer_funds_between_accounts: {
      value: "requests.transfer_funds_between_accounts",
      label: "Transfer Funds Between Accounts",
      description: "Permission to transfer funds between accounts",
    },
    change_account_leverage: {
      value: "requests.change_account_leverage",
      label: "Change Account Leverage",
      description: "Permission to change account leverage",
    },
  },
  TRANSACTIONS: {
    view_transactions: {
      value: "transactions.view_transactions",
      label: "View Transactions",
      description: "Permission to view transactions",
    },
    export_transactions: {
      value: "transactions.export_transactions",
      label: "Export Transactions",
      description: "Permission to export transactions",
    },
    edit_transaction_refund: {
      value: "transactions.edit_transaction_refund",
      label: "Edit Transaction Refund",
      description: "Permission to edit transaction refund",
    },
  },
  NOTES: {
    view_notes: {
      value: "notes.view_notes",
      label: "View Notes",
      description: "Permission to view notes",
    },
    create_note: {
      value: "notes.create_note",
      label: "Create Note",
      description: "Permission to create notes",
    },
    update_note: {
      value: "notes.update_note",
      label: "Update Note",
      description: "Permission to update notes",
    },
    delete_note: {
      value: "notes.delete_note",
      label: "Delete Note",
      description: "Permission to delete notes",
    },
  },
  FINANCIAL_NOTES: {
    view_financial_notes: {
      value: "financial_notes.view_financial_notes",
      label: "View Financial Notes",
      description: "Permission to view financial notes",
    },
    create_financial_note: {
      value: "financial_notes.create_financial_note",
      label: "Create Financial Note",
      description: "Permission to create financial notes",
    },
    update_financial_note: {
      value: "financial_notes.update_financial_note",
      label: "Update Financial Note",
      description: "Permission to update financial notes",
    },
    delete_financial_note: {
      value: "financial_notes.delete_financial_note",
      label: "Delete Financial Note",
      description: "Permission to delete financial notes",
    },
  },
  RIBBONS: {
    view_ribbons: {
      value: "ribbons.view_ribbons",
      label: "View Ribbons",
      description: "Permission to view ribbons",
    },
    update_ribbons: {
      value: "ribbons.update_ribbons",
      label: "Update Ribbons",
      description: "Permission to update ribbons",
    },
    create_ribbons: {
      value: "ribbons.create_ribbons",
      label: "Create Ribbons",
      description: "Permission to create ribbons",
    },
  },
  USER_SEGMENTS: {
    view_user_segments: {
      value: "user_segments.view_user_segments",
      label: "View User Segments",
      description: "Permission to view user segments",
    },
    update_user_segments: {
      value: "user_segments.update_user_segments",
      label: "Update User Segments",
      description: "Permission to update user segments",
    },
    create_user_segments: {
      value: "user_segments.create_user_segments",
      label: "Create User Segments",
      description: "Permission to create user segments",
    },
    view_user_segment_results: {
      value: "user_segments.view_user_segment_results",
      label: "View User Segment Results",
      description: "Permission to view user segment results",
    },
    delete_user_segments: {
      value: "user_segments.delete_user_segments",
      label: "Delete User Segments",
      description: "Permission to delete user segments",
    },
  },
  TRADES: {
    view_positions: {
      value: "trades.view_positions",
      label: "View Positions",
      description: "Permission to view positions",
    },
    view_orders: {
      value: "trades.view_orders",
      label: "View Orders",
      description: "Permission to view orders",
    },
    view_deals: {
      value: "trades.view_deals",
      label: "View Deals",
      description: "Permission to view deals",
    },
  },
  CRM_USERS: {
    get_crm_users: {
      value: "crm_users.get_crm_users",
      label: "Get CRM Users",
      description: "Permission to get CRM users",
    },
    create_crm_user: {
      value: "crm_users.create_crm_user",
      label: "Create CRM User",
      description: "Permission to create CRM users",
    },
    update_crm_user: {
      value: "crm_users.update_crm_user",
      label: "Update CRM User",
      description: "Permission to update CRM users",
    },
    delete_crm_user: {
      value: "crm_users.delete_crm_user",
      label: "Delete CRM User",
      description: "Permission to delete CRM users",
    },
    add_crm_user_permissions: {
      value: "crm_users.add_crm_user_permissions",
      label: "Add CRM User Permissions",
      description: "Permission to add permissions for CRM users",
    },
    remove_crm_user_permissions: {
      value: "crm_users.remove_crm_user_permissions",
      label: "Remove CRM User Permissions",
      description: "Permission to remove permissions from CRM users",
    },
    add_crm_user_sales_countries: {
      value: "crm_users.add_crm_user_sales_countries",
      label: "Add CRM User Sales Countries",
      description: "Permission to add sales countries for CRM users",
    },
    remove_crm_user_sales_countries: {
      value: "crm_users.remove_crm_user_sales_countries",
      label: "Remove CRM User Sales Countries",
      description: "Permission to remove sales countries from CRM users",
    },
    update_crm_user_whitelist_countries: {
      value: "crm_users.update_crm_user_whitelist_countries",
      label: "Update CRM User Whitelist Countries",
      description: "Permission to update whitelist countries for CRM users",
    },
  },
  ADMINISTRATION: {
    user_logs: {
      value: "administration.user_logs",
      label: "View User Logs (Administration)",
      description: "Permission to view user logs in administration",
    },
  },
  ROLES: {
    view_roles: {
      value: "roles.view_roles",
      label: "View Roles",
      description: "Permission to view roles",
    },
    delete_role: {
      value: "roles.delete_role",
      label: "Delete Role",
      description: "Permission to delete roles",
    },
    create_role: {
      value: "roles.create_role",
      label: "Create Role",
      description: "Permission to create roles",
    },
    add_role_permissions: {
      value: "roles.add_role_permissions",
      label: "Add Role Permissions",
      description: "Permission to add permissions for roles",
    },
    remove_role_permissions: {
      value: "roles.remove_role_permissions",
      label: "Remove Role Permissions",
      description: "Permission to remove permissions from roles",
    },
  },
  DEMOGRAPHICS: {
    get_transactions_per_month: {
      value: "demographics.get_transactions_per_month",
      label: "Get Transactions Per Month",
      description: "Permission to get transactions per month",
    },
    get_users_per_country: {
      value: "demographics.get_users_per_country",
      label: "Get Users Per Country",
      description: "Permission to get users per country",
    },
    get_users_per_device: {
      value: "demographics.get_users_per_device",
      label: "Get Users Per Device",
      description: "Permission to get users per device",
    },
    get_users_per_timeframe: {
      value: "demographics.get_users_per_timeframe",
      label: "Get Users Per Timeframe",
      description: "Permission to get users per timeframe",
    },
  },
  SCHEDULED_FUNCTIONS: {
    view_functions: {
      value: "scheduled_functions.view_functions",
      label: "View Scheduled Functions",
      description: "Permission to view scheduled functions",
    },
    edit_functions: {
      value: "scheduled_functions.edit_functions",
      label: "Edit Scheduled Functions",
      description: "Permission to edit scheduled functions",
    },
    forcerun_functions: {
      value: "scheduled_functions.forcerun_functions",
      label: "Force Run Scheduled Functions",
      description: "Permission to force run scheduled functions",
    },
  },
  REPORTS: {
    finances: {
      value: "reports.finances",
      label: "Finances Report",
      description: "Permission to view finances report",
    },
    first_time_deposits: {
      value: "reports.first_time_deposits",
      label: "First Time Deposits Report",
      description: "Permission to view first time deposits report",
    },
    utm_reports: {
      value: "reports.utm_reports",
      label: "UTM Reports",
      description: "Permission to view UTM reports",
    },
    active_traders: {
      value: "reports.active_traders",
      label: "Active Traders Report",
      description: "Permission to view active traders report",
    },
    balance_report: {
      value: "reports.balance_report",
      label: "Balance Report",
      description: "Permission to view balance report",
    },
  },
  INTERNAL: {
    server_status: {
      value: "internal.server_status",
      label: "Check Server Status",
      description: "Permission to check server status",
    },
    daily_analysis_email: {
      value: "internal.daily_analysis_email",
      label: "Send Daily Analysis Email",
      description: "Permission to send daily analysis email",
    },
    openpayd_update_details: {
      value: "internal.openpayd_update_details",
      label: "Update OpenPayd Details",
      description: "Permission to update OpenPayd details",
    },
    openpayd_sweep: {
      value: "internal.openpayd_sweep",
      label: "Run OpenPayd Sweep",
      description: "Permission to run OpenPayd sweep",
    },
    translation_tool: {
      value: "internal.translation_tool",
      label: "Use Translation Tool",
      description: "Permission to use translation tool",
    },
    ai_blogpost_generator: {
      value: "internal.ai_blogpost_generator",
      label: "Generate AI Blog Posts",
      description: "Permission to generate AI blog posts",
    },
    ib_leads_upload: {
      value: "internal.ib_leads_upload",
      label: "Upload IB Leads",
      description: "Permission to upload IB leads",
    },
  },
});

export const PERMISSIONS_LIST = Object.freeze(
  Object.values(PERMISSIONS)
    .map((permGroup) => Object.values(permGroup).map(({ value }) => value))
    .flat()
);

export const PERMISSIONS_CATEGORIES = Object.freeze(Object.keys(PERMISSIONS));

export const PERMISSIONS_MAP = Object.freeze(
  Object.values(PERMISSIONS).reduce((acc, curr) => {
    const t = Object.values(curr).reduce((a, c) => {
      const x = { [c.value]: c.label };
      a = { ...a, ...x };
      return a;
    }, {});
    acc = { ...acc, ...t };
    return acc;
  }, {})
);
