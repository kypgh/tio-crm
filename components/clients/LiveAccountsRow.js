import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useState } from "react";
import { BiSolidUserAccount } from "react-icons/bi";
import { CgMoreO } from "react-icons/cg";
import { GiReceiveMoney, GiTwoCoins } from "react-icons/gi";
import { MdCompareArrows, MdDeleteForever, MdEditNote } from "react-icons/md";
import { RiBarChartBoxFill, RiBarChartBoxLine } from "react-icons/ri";
import styled, { useTheme } from "styled-components";

import agent from "../../utils/agent";
import { formatCurrency, getAccountTypeDetails } from "../../utils/helpers";
import {
  useAccountClosedTrades,
  useAccountOpenTrades,
} from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import ConfirmModal from "../ConfirmModal";
import ModalHook from "../ModalHook";
import PCR from "../PCR";
import TooltipWrapper from "../TooltipWrapper";
import { useNotification } from "../actionNotification/NotificationProvider";
import { Dropdown } from "../generic";
import AccountFinances from "../modalHookViews/AccountFinances";
import BalanceOperation from "../modalHookViews/BalanceOperation";
import ClosedTrades from "../modalHookViews/ClosedTrades";
import CreditOperation from "../modalHookViews/CreditOperation";
import EditTradingAccount from "../modalHookViews/EditTradingAccount";
import OpenTrades from "../modalHookViews/OpenTrades";
import TransferOperation from "../modalHookViews/TransferOperation";
import { Cell, Row } from "../tableComponents/TableGeneric";

export default function LiveAccountsRow({ account, userId }) {
  const theme = useTheme();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const queryClient = useQueryClient();
  const actionNotification = useNotification();

  const [selectedBrand] = useSelectedBrand();

  const deleteAccountMutation = useMutation(
    () => agent().deleteClientAccount(account._id),
    {
      mutationKey: ["deleteLiveAccount"],
      onSuccess: () => {
        {
          queryClient.invalidateQueries([selectedBrand, "clientAccounts"]);
          actionNotification.WARNING("Live account deleted");
        }
      },
    }
  );

  const openTradesData = useAccountOpenTrades(account._id);
  const openTrades = openTradesData.data?.totalDocs;

  const closedTradesData = useAccountClosedTrades(account._id);
  const closedTrades = closedTradesData.data?.totalDocs;

  return (
    <>
      <Row>
        <Cell isSmall>{account.login_id}</Cell>
        <Cell isExtraSmall>
          {getAccountTypeDetails(account, selectedBrand).label}
        </Cell>
        <Cell isSmall>{account.platform}</Cell>
        <Cell isSmall>1:{account.leverage}</Cell>
        <Cell isSmall>{account.currency}</Cell>
        <Cell>{formatCurrency(account?.balance, account.currency)}</Cell>
        <Cell>{formatCurrency(account?.equity, account.currency)}</Cell>
        <Cell>{formatCurrency(account?.bonus_balance, account.currency)}</Cell>
        <Cell>{formatCurrency(account?.free_margin, account.currency)}</Cell>
        <Cell>{account?.volume ?? "0"}</Cell>
        <Cell
          style={{
            flexDirection: "column",
          }}
        >
          <p> {DateTime.fromISO(account.createdAt).toFormat("dd/MM/yyyy")}</p>
          <p> {DateTime.fromISO(account.createdAt).toFormat("HH:mm:ss")}</p>
        </Cell>
        <Cell isSmall>{openTrades}</Cell>
        <Cell isMedium>{closedTrades}</Cell>
        <Cell isExtraSmall style={{ justifyContent: "flex-start" }}>
          <Dropdown dropdownComponent={<DropdownList account={account} />}>
            <TooltipWrapper tooltip="More">
              <CgMoreO color={theme.blue} size={16} />
            </TooltipWrapper>
          </Dropdown>
          <PCR.deleteAccount>
            <TooltipWrapper tooltip="Delete Account" position="top-left">
              <MdDeleteForever
                color={theme.errorMsg}
                onClick={() => {
                  setShowConfirmModal(true);
                }}
                size={20}
              />
            </TooltipWrapper>
          </PCR.deleteAccount>
        </Cell>
      </Row>
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this account?"
          onConfirm={() => {
            deleteAccountMutation.mutate();
            setShowConfirmModal(false);
          }}
          onReject={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
}

const ListOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: ${({ theme }) => theme.primary};
  padding: 5px;
  border-radius: 5px;
`;

const ListItem = styled.div`
  display: flex;
  align-content: center;
  gap: 5px;
  cursor: pointer;
  transition: 0.3s all ease;
  padding: 2px 3px;
  border-radius: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

const DropdownList = ({ account }) => {
  const queryClient = useQueryClient();
  const theme = useTheme();

  const [selectedBrand] = useSelectedBrand();
  return (
    <ListOuter>
      <PCR.viewPositions>
        <ModalHook componentToShow={<OpenTrades account={account} />}>
          {({ openModal }) => (
            <ListItem
              onClick={(e) => {
                openModal(e);
              }}
            >
              <RiBarChartBoxFill color={theme.blue} size={20} />
              <span>Open Trades</span>
            </ListItem>
          )}
        </ModalHook>
        <ModalHook componentToShow={<ClosedTrades account={account} />}>
          {({ openModal }) => (
            <ListItem onClick={openModal}>
              <RiBarChartBoxLine color={theme.blue} size={20} />
              <span>Closed Trades</span>
            </ListItem>
          )}
        </ModalHook>
      </PCR.viewPositions>
      <PCR.updateAccount>
        <ModalHook
          componentToShow={<EditTradingAccount account={account} />}
          onCloseModal={() =>
            queryClient.invalidateQueries([selectedBrand, "clientAccounts"])
          }
        >
          {({ openModal }) => (
            <ListItem onClick={openModal}>
              <MdEditNote onClick={openModal} color={theme.blue} size={20} />
              <span>Settings</span>
            </ListItem>
          )}
        </ModalHook>
      </PCR.updateAccount>
      <PCR.balanceOperation>
        <ModalHook
          onCloseModal={() =>
            queryClient.invalidateQueries([selectedBrand, "clientAccounts"])
          }
          componentToShow={<BalanceOperation account={account} />}
        >
          {({ openModal }) => (
            <ListItem onClick={openModal}>
              <GiReceiveMoney color={theme.blue} size={20} />
              <span>Balance Operation</span>
            </ListItem>
          )}
        </ModalHook>
      </PCR.balanceOperation>
      <PCR.updateAccount>
        <ModalHook
          componentToShow={
            <TransferOperation
              userId={account.user._id || account.user}
              accountFromDefault={account}
            />
          }
        >
          {({ openModal }) => (
            <ListItem onClick={openModal}>
              <MdCompareArrows
                onClick={openModal}
                color={theme.blue}
                size={20}
              />
              <span>Transfer Operation</span>
            </ListItem>
          )}
        </ModalHook>
      </PCR.updateAccount>
      <PCR.balanceOperation>
        <ModalHook
          onCloseModal={() =>
            queryClient.invalidateQueries([selectedBrand, "clientAccounts"])
          }
          componentToShow={<CreditOperation account={account} />}
        >
          {({ openModal }) => (
            <ListItem onClick={openModal}>
              <GiTwoCoins color={theme.blue} size={20} />
              <span>Credit Operation</span>
            </ListItem>
          )}
        </ModalHook>
      </PCR.balanceOperation>
      <PCR.viewTransactions>
        <ModalHook componentToShow={<AccountFinances account={account} />}>
          {({ openModal }) => (
            <ListItem onClick={openModal}>
              <BiSolidUserAccount color={theme.blue} size={20} />
              <span>Account Finances</span>
            </ListItem>
          )}
        </ModalHook>
      </PCR.viewTransactions>
    </ListOuter>
  );
};
