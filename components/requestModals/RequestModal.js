import React from "react";
import DeleteAccountRequestModal from "./DeleteAccountRequestModal";
import TransferBetweenAccountsRequestModal from "./TransferBetweenAccountsRequestModal";
import WithdrawalRequestModal from "./WithdrawalRequestModal";
import PendingCryptoDepositModal from "./PendingCryptoDepositModal";
import ChangeAccountLeverageRequestModal from "./ChangeAccountLeverageRequestModal";

const modalMap = {
  withdrawFromAccount: (props) => <WithdrawalRequestModal {...props} />,
  deleteAccount: (props) => <DeleteAccountRequestModal {...props} />,
  depositCryptoToAccount: (props) => <PendingCryptoDepositModal {...props} />,
  transferFundsBetweenAccounts: (props) => (
    <TransferBetweenAccountsRequestModal {...props} />
  ),
  changeAccountLeverage: (props) => (
    <ChangeAccountLeverageRequestModal {...props} />
  ),
};

function RequestModal({ requestType, requestId, closeModal }) {
  return modalMap[requestType]({ requestId, closeModal });
}

export default RequestModal;
