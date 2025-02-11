export const USER_LOGS_ACTION_TYPES = Object.freeze({
  registered: "registered",
  loggedIn: "loggedIn",
  createAccount: "createAccount",
  deleteAccountRequest: "deleteAccountRequest",
  changePassword: "changePassword",
  changeEmail: "changeEmail",
  uploadKYCDocument: "uploadKYCDocument",
  approveKYCDocument: "approveKYCDocument",
  rejectKYCDocument: "rejectKYCDocument",
  userRequestAction: "userRequestAction",
  depositTransaction: "depositTransaction",
  withdrawTransaction: "withdrawTransaction",
  withdrawalRequest: "withdrawalRequest",
  withdrawalApproved: "withdrawalApproved",
  withdrawalRejected: "withdrawalRejected",
  depositCryptoRequest: "depositCryptoRequest",
  depositCryptoRequestApproved: "depositCryptoRequestApproved",
  depositCryptoRequestRejected: "depositCryptoRequestRejected",
  depositCrypto: "depositCrypto",
  balanceOperationDeposit: "balanceOperationDeposit",
  balanceOperationWithdrawal: "balanceOperationWithdrawal",
  requestTransferBetweenAccounts: "requestTransferBetweenAccounts",
  requestTransferBetweenAccountsApproved:
    "requestTransferBetweenAccountsApproved",
  requestTransferBetweenAccountsRejected:
    "requestTransferBetweenAccountsRejected",
  changeAccountLeverage: "changeAccountLeverage",
  changeAccountLeverageApproved: "changeAccountLeverageApproved",
  changeAccountLeverageRejected: "changeAccountLeverageRejected",
});
