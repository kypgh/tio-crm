import styled, { useTheme } from "styled-components";

import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import Link from "next/link";
import { FaQuestion } from "react-icons/fa";
import { getGatewaysForBrand } from "../../config/paymentGateways";
import {
  formatCurrency,
  getTransactionIcon,
  getTransactionStatusIcon,
} from "../../utils/helpers";
import { useLatestTransactions } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import TooltipWrapper from "../TooltipWrapper";
import { Refresh } from "../generic";
import {
  Cell,
  FilterContainer,
  FilterInnerContainer,
  Row,
  TableData,
  TableLoader,
  TableOuter,
} from "./TableGeneric";

const MiniTitle = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableKeyDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  gap: 4px;
  & > p {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const LatestTransactionsTable = ({ miniTitle = "" }) => {
  const theme = useTheme();

  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useLatestTransactions();

  const [selectedBrand] = useSelectedBrand();
  const paymentGateways = getGatewaysForBrand(selectedBrand);

  if (isLoading || isFetching) {
    return <TableLoader theme={theme} />;
  }
  return (
    <TableOuter theme={theme}>
      <FilterContainer
        style={{ justifyContent: "space-between" }}
        theme={theme}
      >
        <FilterInnerContainer theme={theme}>
          <MiniTitle theme={theme}>{miniTitle}</MiniTitle>
          <TooltipWrapper
            theme={theme}
            tooltip={
              <TableKeyDescription>
                <p>{getTransactionIcon("deposit")} Deposit</p>
                <p>
                  {getTransactionIcon("balance_operation_deposit")} Deposit
                  (Balance operation)
                </p>
                <p>{getTransactionIcon("withdrawal")} Withdrawal</p>
                <p>
                  {getTransactionIcon("balance_operation_withdrawal")}{" "}
                  Withdrawal (Balance operation)
                </p>
              </TableKeyDescription>
            }
          >
            <FaQuestion color={theme.textSecondary} size={14} />
          </TooltipWrapper>
        </FilterInnerContainer>
        <Refresh
          theme={theme}
          onClick={() =>
            queryClient.invalidateQueries([selectedBrand, "latestTransactions"])
          }
        />
      </FilterContainer>
      <TableData theme={theme}>
        <Row header theme={theme}>
          <Cell theme={theme} center>
            Client ID / Account ID
          </Cell>
          <Cell theme={theme} center>
            Payment Method
          </Cell>
          <Cell theme={theme} center>
            Amount
          </Cell>
          <Cell theme={theme} center>
            Date | Time
          </Cell>
        </Row>
        {data?.docs.map((x, i) => (
          <Link href={`/clients/${x.user._id}/finances`} key={i}>
            <a style={{ textDecoration: "none" }}>
              <Row theme={theme} actionable>
                <Cell theme={theme} center style={{ gap: "15px" }}>
                  {x.user.readableId}
                  {" / "}
                  {x.userAccount.login_id}
                  {getTransactionIcon(x.transaction_type)}
                </Cell>
                <Cell theme={theme} center>
                  {paymentGateways.some(
                    (element) => element.id === x.payment_method
                  )
                    ? paymentGateways.find(
                        (element) => element.id === x.payment_method
                      ).title
                    : x.payment_method}
                </Cell>
                <Cell
                  theme={theme}
                  center
                  style={{ justifyContent: "space-evenly" }}
                >
                  {getTransactionStatusIcon(x.transaction_status)}
                  {formatCurrency(x.amount, x.currency)}
                </Cell>
                <Cell theme={theme} center>
                  {DateTime.fromISO(x.createdAt).toFormat("dd/MM/yyyy | HH:mm")}
                </Cell>
              </Row>
            </a>
          </Link>
        ))}
      </TableData>
    </TableOuter>
  );
};

export default LatestTransactionsTable;
