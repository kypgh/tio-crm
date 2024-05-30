export const NEXT_PUBLIC_BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const NEXT_PUBLIC_SCHEDULED_FUNCTIONS_API_URL =
  process.env.NEXT_PUBLIC_SCHEDULED_FUNCTIONS_API_URL;
export const NEXT_PUBLIC_DAILY_ANALYSIS_API_URL =
  process.env.NEXT_PUBLIC_DAILY_ANALYSIS_API_URL;
export const NEXT_PUBLIC_TRANSLATION_TOOL_API_URL =
  process.env.NEXT_PUBLIC_TRANSLATION_TOOL_API_URL;
export const NEXT_PUBLIC_PRICE_FEED_WS = process.env.NEXT_PUBLIC_PRICE_FEED_WS;
export const NEXT_PUBLIC_IB_LEADS_API_URL =
  process.env.NEXT_PUBLIC_IB_LEADS_API_URL;

// Mapping for request types
export const requestTypesMap = Object.freeze({
  deleteAccount: "Delete Account",
  withdrawFromAccount: "Withdraw from Account",
  transferFundsBetweenAccounts: "Transfer Funds Between Accounts",
});

export const WITHDRAWAL_METHODS = Object.freeze([
  "skrill",
  "bank_wire",
  "neteller",
  "credit_card",
]);

// Mapping for User Logs
export const userLogsMap = Object.freeze({
  createAccount: "createAccount",
  deleteAccountRequest: "deleteAccountRequest",
  changePassword: "changePassword",
  uploadKYCDocument: "uploadKYCDocument",
  approveKYCDocument: "approveKYCDocument",
  rejectKYCDocument: "rejectKYCDocument",
});

export const USER_ALLOWED_DOCUMENTS = Object.freeze({
  id_document: "id_document",
  id_document_history: "id_document_history",
  proof_of_address: "proof_of_address",
  proof_of_address_history: "proof_of_address_history",
  other: "other",
});

export const CRM_USER_DEPARTMENTS = Object.freeze({
  sales: "sales",
  support: "support",
  marketing: "marketing",
  admin: "admin",
  funding: "funding",
  dealing: "dealing",
  compliance: "compliance",
  accounting: "accounting",
  developer: "developer",
});

export const ACCOUNT_TYPES = Object.freeze([
  {
    name: "standard",
    groupName: "TIO-CT_Std",
    label: "Standard",
    minDeposit: 50,
  },
  {
    name: "vip",
    groupName: "TIO-CT_VIP",
    label: "VIP",
    minDeposit: 1000,
  },
  {
    name: "vipblack",
    groupName: "TIO-CT_VIPB",
    label: "VIP Black",
    minDeposit: 3000,
  },
]);

export const DEMO_ACCOUNT_TYPES = Object.freeze([
  {
    name: "standard",
    groupName: "Demo-CT_Std",
    label: "Standard",
  },
  {
    name: "vip",
    groupName: "Demo-CT-VIP",
    label: "VIP",
  },
  {
    name: "vipblack",
    groupName: "Demo-CT-VIPB",
    label: "VIP Black",
  },
]);

export const LEVERAGES = Object.freeze([
  {
    name: "standard",
    value: [50, 100, 200, 300, 400, 500],
  },
  {
    name: "vip",
    value: [50, 100, 200],
  },
  {
    name: "vipblack",
    value: [50, 100, 200],
  },
]);

export const USER_REQUEST_TYPES = Object.freeze({
  deleteAccount: "deleteAccount",
  withdrawFromAccount: "withdrawFromAccount",
  depositCryptoToAccount: "depositCryptoToAccount",
  transferFundsBetweenAccounts: "transferFundsBetweenAccounts",
  changeAccountLeverage: "changeAccountLeverage",
});

export const USER_TRANSACTION_STATUS = Object.freeze({
  payment_pending: "pending",
  payment_authorized: "authorized",
  payment_approved: "approved",
  payment_rejected: "rejected",
  payment_cancelled: "cancelled",
  payment_error: "error",
  payment_partial_refund: "partial_refund",
  payment_refund: "refund",
  payment_chargeback: "chargeback",
  payment_duplicated: "duplicated",
  withdrawal_initialized: "initialized",
  withdrawal_pending: "pending",
  withdrawal_approved: "approved",
  withdrawal_rejected: "rejected",
  withdrawal_error: "error",
});

export const USER_TRANSACTION_TYPES = Object.freeze({
  deposit: "deposit",
  withdrawal: "withdrawal",
  balance_operation_deposit: "balance_operation_deposit",
  balance_operation_withdrawal: "balance_operation_withdrawal",
  credit_operation_deposit: "credit_operation_deposit",
  credit_operation_withdrawal: "credit_operation_withdrawal",
  transfer_between_accounts: "transfer_between_accounts",
});

export const BRANDS_MAP = Object.freeze({
  TIO: "TIOmarkets",
  PIX: "Prime Index",
});

//prettier-ignore
export const USD_SYMBOLS = Object.freeze([
  "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCHF", "USDCAD", "NZDUSD", "USDNOK", 
  "USDMXN", "USDSGD", "USDSEK", "USDPLN", "USDDKK", "XAUUSD", "XAGUSD", "USDTRY", 
  "USDHKD", "USDZAR", "USDHUF", "USDCZK", "USDRUB", "USDCNH", "USDRON", "USDTHB", 
  "XPDUSD", "XPTUSD", "BTCUSD", "ETHUSD", "USDTUSD", "LTCUSD", "TIOUSD",
]);

//prettier-ignore
export const FOREX_SYMBOLS = Object.freeze([
  "EURUSD", "GBPUSD", "EURJPY", "USDJPY", "AUDUSD", "USDCHF", "GBPJPY", "USDCAD", 
  "EURGBP", "EURCHF", "AUDJPY", "NZDUSD", "CHFJPY", "EURAUD", "CADJPY", "GBPAUD", 
  "EURCAD", "AUDCAD", "GBPCAD", "AUDNZD", "NZDJPY", "USDNOK", "AUDCHF", "USDMXN", 
  "GBPNZD", "EURNZD", "CADCHF", "USDSGD", "USDSEK", "NZDCAD", "EURSEK", "GBPSGD", 
  "EURNOK", "EURHUF", "USDPLN", "USDDKK", "GBPNOK", "AUDDKK", "NZDCHF", "GBPCHF", 
  "USDTRY", "EURTRY", "EURHKD", "EURZAR", "SGDJPY", "USDHKD", "USDZAR", "EURMXN", 
  "EURPLN", "GBPZAR", "NZDSGD", "USDHUF", "EURCZK", "USDCZK", "EURDKK", "EURRUB", 
  "USDRUB", "USDCNH", "GBPSEK", "GBPPLN", "AUDSEK", "AUDSGD", "AUDZAR", "CADDKK", 
  "CADHKD", "CADMXN", "CADNOK", "CADSEK", "CADSGD", "CHFNOK", "CHFPLN", "CHFSEK", 
  "CHFSGD", "CHFZAR", "DKKNOK", "DKKSEK", "EURCNH", "EURILS", "EURRON", "EURSGD", 
  "GBPDKK", "GBPTRY", "HKDJPY", "NOKJPY", "NOKSEK", "NZDSEK", "TRYJPY", "USDRON", 
  "USDTHB", "ZARJPY"
]);

export const FOREX_SYMBOLS_USD_CONVERSIONS = Object.freeze({
  EURJPY: "USDJPY",
  GBPJPY: "USDJPY",
  EURGBP: "GBPUSD",
  EURCHF: "USDCHF",
  AUDJPY: "USDJPY",
  CHFJPY: "USDJPY",
  EURAUD: "AUDUSD",
  CADJPY: "USDJPY",
  GBPAUD: "AUDUSD",
  EURCAD: "USDCAD",
  AUDCAD: "USDCAD",
  GBPCAD: "USDCAD",
  AUDNZD: "NZDUSD",
  NZDJPY: "USDJPY",
  AUDCHF: "USDCHF",
  GBPNZD: "NZDUSD",
  EURNZD: "NZDUSD",
  CADCHF: "USDCHF",
  NZDCAD: "USDCAD",
  EURSEK: "USDSEK",
  GBPSGD: "USDSGD",
  EURNOK: "USDNOK",
  EURHUF: "USDHUF",
  GBPNOK: "USDNOK",
  AUDDKK: "USDDKK",
  NZDCHF: "USDCHF",
  GBPCHF: "USDCHF",
  EURTRY: "USDTRY",
  EURHKD: "USDHKD",
  EURZAR: "USDZAR",
  SGDJPY: "USDJPY",
  EURMXN: "USDMXN",
  EURPLN: "USDPLN",
  GBPZAR: "USDZAR",
  NZDSGD: "USDSGD",
  EURCZK: "USDCZK",
  EURDKK: "USDDKK",
  EURRUB: "USDRUB",
  GBPSEK: "USDSEK",
  GBPPLN: "USDPLN",
  AUDSEK: "USDSEK",
  AUDSGD: "USDSGD",
  AUDZAR: "USDZAR",
  CADDKK: "USDDKK",
  CADHKD: "USDHKD",
  CADMXN: "USDMXN",
  CADNOK: "USDNOK",
  CADSEK: "USDSEK",
  CADSGD: "USDSGD",
  CHFNOK: "USDNOK",
  CHFPLN: "USDPLN",
  CHFSEK: "USDSEK",
  CHFSGD: "USDSGD",
  CHFZAR: "USDZAR",
  DKKNOK: "USDNOK",
  DKKSEK: "USDSEK",
  EURCNH: "USDCNH",
  EURILS: "EURUSD",
  EURRON: "USDRON",
  EURSGD: "USDSGD",
  GBPDKK: "USDDKK",
  GBPTRY: "USDTRY",
  HKDJPY: "USDJPY",
  NOKJPY: "USDJPY",
  NOKSEK: "USDSEK",
  NZDSEK: "USDSEK",
  TRYJPY: "USDJPY",
  ZARJPY: "USDJPY",
});

export const CALENDAR_EVENT_TYPES = Object.freeze({
  follow_up: "follow_up",
  // generic: "generic",
});
