import styled from "styled-components";
import availableFields from "../../config/tablesAvailableFields";
import agent from "../../utils/agent";
import { formatFilters } from "../../utils/functions";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import { FormTitle } from "../formComponents/FormGeneric";
import GridTable from "../tableComponents/GridTable";
import {
  FieldsFilter,
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
} from "../tableComponents/TableGeneric";
import ModalHook from "../ModalHook";
import TooltipWrapper from "../TooltipWrapper";
import { RiRefund2Line } from "react-icons/ri";
import { DateTime } from "luxon";
import OneLineText from "../OneLineText";
import Link from "next/link";
import { RefundActionModal } from "../clients/FinancesDetails";
import { formatCurrency } from "../../utils/helpers";
import { getGatewayByID } from "../../config/paymentGateways";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 150px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 3px;
  padding: 0 20px;
  position: relative;
  max-width: calc(100% - 300px);
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto 1fr auto;
  & > *:nth-child(2) {
    flex-grow: 1;
    flex-shrink: 1;
  }
`;

const RefundButton = styled.p`
  border-radius: 3px;
  background-color: ${({ theme }) => theme.brand};
  padding: 0px 5px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.65px;
  color: rgba(255, 255, 255, 0.8);
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 2px;
`;
const RefundedLabel = styled.p`
  border-radius: 3px;
  background-color: #42ff42;
  padding: 0px 5px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const transactionTypeMap = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  balance_operation_deposit: "Deposit (Balance Op)",
  balance_operation_withdrawal: "Withdrawal (Balance Op)",
  credit_operation_deposit: "Deposit (Credit Op)",
  credit_operation_withdrawal: "Withdrawal (Credit Op)",
  transfer_between_accounts: "Transfer",
};

const AccountFinances = ({ account }) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    selectedFields,
    tableRows,
    reorderFields,
    resizeFields,
    refetch,
  } = useTabledQuery(
    ["accountFinances", account._id],
    async (param) => {
      const {
        page = 1,
        limit = 50,
        user_id,
        transaction_type,
        status,
        sort,
        filters = {},
      } = param;

      return agent()
        .getTransactions(
          page,
          limit,
          user_id,
          transaction_type,
          status,
          sort,
          formatFilters({ ...filters, userAccount: account._id })
        )
        .then((res) => res.data);
    },
    {
      availableFields: availableFields.USER_FINANCES,
      rowFunctionality: (item) => {
        if (item.bitgoTransferId) {
          window.open(
            `https://app.bitgo.com/0/0/transactions/transfer/${item.bitgoTransferId}?wallet=${item.bitgoWalletId}&coin=${item.bitgoCoin}`,
            "_blank"
          );
        } else if (item.transaction_id) {
          window.open(
            `https://atlas.praxispay.com/transaction/view?trace_id=${item.tid}`,
            "_blank"
          );
        } else {
          // notificationManager.INFO("Nothing to view");
        }
      },
      fieldFunctionality: {
        cid: {
          format: (v, doc) => (
            <Link href={`/clients/${doc.user._id}`} passHref>
              <a style={{ textDecoration: "none", color: "inherit" }}>{v}</a>
            </Link>
          ),
        },

        processedCurrency: {
          format: (v, doc) => (v ? v : `N/A - (${doc.currency})`),
        },
        paymentMethod: {
          format: (method) => (
            <OneLineText width="190px">
              {getGatewayByID(method)?.title ?? method}
            </OneLineText>
          ),
        },
        processedAmount: {
          format: (v, doc) =>
            doc.processed_currency
              ? formatCurrency(v, doc.processed_currency)
              : `N/A - (${formatCurrency(doc.amount, doc.currency)})`,
        },
        processedUsdAmount: {
          format: (v) => (v ? `$ ${Number(v).toFixed(2)}` : "N/A"),
        },
        createdAt: {
          format: (v) => DateTime.fromISO(v).toFormat("dd/MM/yyyy - HH:mm"),
        },
        updatedAt: {
          format: (v) => DateTime.fromISO(v).toFormat("dd/MM/yyyy - HH:mm"),
        },
        transactionType: {
          format: (v) => transactionTypeMap[v],
        },
        refund: {
          format: (v) => v ?? 0,
        },
        actions: {
          format: (v, doc) => (
            <>
              {doc?.payment_processor?.toLowerCase().includes("virtualpay") &&
                doc?.processed_amount !== doc?.refund_amount && (
                  <ModalHook
                    componentToShow={<RefundActionModal transaction={doc} />}
                  >
                    {({ openModal }) => (
                      <TooltipWrapper
                        tooltip={"Refund Transaction - Virtual Pay"}
                      >
                        <RefundButton
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal();
                          }}
                        >
                          <RiRefund2Line size={16} /> REFUND
                        </RefundButton>
                      </TooltipWrapper>
                    )}
                  </ModalHook>
                )}
              {doc?.payment_processor?.toLowerCase().includes("virtualpay") &&
                doc?.processed_amount === doc?.refund_amount && (
                  <>
                    <ModalHook
                      componentToShow={<RefundActionModal transaction={doc} />}
                    >
                      {({ openModal }) => (
                        <TooltipWrapper
                          tooltip={"Refund Transaction - Virtual Pay"}
                        >
                          <RefundedLabel
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal();
                            }}
                          >
                            REFUNDED
                          </RefundedLabel>
                        </TooltipWrapper>
                      )}
                    </ModalHook>
                  </>
                )}
            </>
          ),
        },
      },
    }
  );

  return (
    <Outer>
      <FormTitle
        style={{
          paddingTop: "10px",
        }}
      >
        Finances for Account ID: {account.login_id}
      </FormTitle>
      <Container>
        <div>
          <FilterContainer style={{ justifyContent: "space-between" }}>
            <FilterInnerContainer
              style={{
                justifyContent: "space-between",
                width: "fit-content",
              }}
            >
              <FieldsFilter
                availbleFields={availableFields.USER_FINANCES}
                title="User Transactions Fields"
              />
            </FilterInnerContainer>
          </FilterContainer>
        </div>
        <GridTable
          isLoading={isLoading || isFetching}
          headers={selectedFields}
          onReorder={reorderFields}
          onResize={resizeFields}
        >
          {({ Row, Cell }) =>
            tableRows.map((row) => (
              <Row key={row._id} onClick={row.onClick} actionable>
                {row.fields.map((field) => (
                  <Cell
                    key={field.key}
                    onClick={field.onClick}
                    actionable={field.key === "user.ctrader_id"}
                  >
                    {field.value}
                  </Cell>
                ))}
              </Row>
            ))
          }
        </GridTable>
        <PaginationSettings data={data || {}} />
      </Container>
    </Outer>
  );
};

export default AccountFinances;
