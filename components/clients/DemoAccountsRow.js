import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";

import { MdDeleteForever } from "react-icons/md";
import { RiBarChartBoxLine, RiBarChartBoxFill } from "react-icons/ri";

import agent from "../../utils/agent";
import ConfirmModal from "../ConfirmModal";
import { Cell, Row } from "../tableComponents/TableGeneric";
import { useNotification } from "../actionNotification/NotificationProvider";
import TooltipWrapper from "../TooltipWrapper";
import ModalHook from "../ModalHook";
import OpenTrades from "../modalHookViews/OpenTrades";
import ClosedTrades from "../modalHookViews/ClosedTrades";
import PCR from "../PCR";
import { formatCurrency, getAccountTypeDetails } from "../../utils/helpers";
import { useTheme } from "styled-components";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";

export default function DemoAccountsRow({ account, userId }) {
  const theme = useTheme();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const queryClient = useQueryClient();
  const actionNotification = useNotification();
  const [selectedBrand] = useSelectedBrand();

  const deleteAccountMutation = useMutation(
    () => agent().deleteClientAccount(account._id),
    {
      mutationKey: ["deleteDemoAccount"],
      onSuccess: () => {
        queryClient.invalidateQueries([
          selectedBrand,
          "clientAccounts",
          userId,
        ]);
        actionNotification.WARNING("Demo account deleted");
      },
    }
  );
  return (
    <>
      <Row>
        <Cell isSmall>{account.login_id}</Cell>
        <Cell>{getAccountTypeDetails(account, selectedBrand).label}</Cell>
        <Cell>{account.platform}</Cell>
        <Cell isSmall>1:{account.leverage}</Cell>
        <Cell isSmall>{account.currency}</Cell>
        <Cell>{formatCurrency(account?.balance, account.currency)}</Cell>
        <Cell>
          {DateTime.fromISO(account.createdAt).toFormat(
            "dd/MM/yyyy - HH:mm:ss"
          )}
        </Cell>
        <Cell style={{ justifyContent: "flex-start" }}>
          <PCR.viewPositions>
            <ModalHook componentToShow={<OpenTrades account={account} />}>
              {({ openModal }) => (
                <TooltipWrapper tooltip="Open Trades" position="top-left">
                  <RiBarChartBoxFill
                    onClick={openModal}
                    color={theme.blue}
                    size={20}
                  />
                </TooltipWrapper>
              )}
            </ModalHook>
            <ModalHook componentToShow={<ClosedTrades account={account} />}>
              {({ openModal }) => (
                <TooltipWrapper tooltip="Closed Trades" position="top-left">
                  <RiBarChartBoxLine
                    onClick={openModal}
                    color={theme.blue}
                    size={20}
                  />
                </TooltipWrapper>
              )}
            </ModalHook>
          </PCR.viewPositions>
          <PCR.deleteAccount>
            <TooltipWrapper tooltip={"Delete Account"}>
              <MdDeleteForever
                color={theme.errorMsg}
                size={20}
                onClick={() => {
                  setShowConfirmModal(true);
                }}
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
