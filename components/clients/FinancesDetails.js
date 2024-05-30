import { DateTime } from "luxon";
import Link from "next/link";

import styled from "styled-components";
import filterOptions from "../../config/filtersOptions";
import { getGatewaysForBrand } from "../../config/paymentGateways";
import availableFields from "../../config/tablesAvailableFields";
import agent from "../../utils/agent";
import { formatCurrency } from "../../utils/helpers";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import useTabledQuery from "../../utils/hooks/useTabledQuery";
import { useNotification } from "../actionNotification/NotificationProvider";
import FiltersBar from "../tableComponents/FiltersBar";
import GridTable from "../tableComponents/GridTable";
import RefreshButton from "../tableComponents/RefreshButton";
import {
  FieldsFilter,
  FilterContainer,
  FilterInnerContainer,
  PaginationSettings,
} from "../tableComponents/TableGeneric";
import ModalHook from "../ModalHook";
import TooltipWrapper from "../TooltipWrapper";
import { RiRefund2Line } from "react-icons/ri";
import { InputField, SumbitButton } from "../formComponents/FormGeneric";
import { ActionButton, NumberInput, NumberInputDos } from "../generic";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OneLineText from "../OneLineText";

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

const transferIntent = {
  payment: "in",
  withdrawal: "out",
};

function FinancesDetails({ user }) {
  const [selectedBrand] = useSelectedBrand();
  const paymentGateways = getGatewaysForBrand(selectedBrand);

  const notificationManager = useNotification();
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
    ["userFinances", user._id],
    (params) =>
      agent()
        .getAllTransactions({
          ...params,
          filters: `user_id:${user._id}${
            params.filters ? `,${params.filters}` : ""
          }`,
        })
        .then((res) => res.data),
    {
      queryOptions: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
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
              {paymentGateways.find((element) => element.id === method)
                ?.title ?? method}
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
          format: (v, doc) => {
            return `${transactionTypeMap[v]}   ${
              transferIntent[doc.intent] ?? ""
            }`;
          },
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

  console.log(data);
  console.log(tableRows);
  if (isLoading || isFetching) return <div>Loading...</div>;
  return (
    <Container>
      <div>
        <FilterContainer style={{ justifyContent: "space-between" }}>
          <FilterInnerContainer style={{ alignItems: "stretch" }}>
            <FiltersBar allowedFilters={filterOptions.USER_FINANCES} />
          </FilterInnerContainer>
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

            <RefreshButton
              onClick={() =>
                refetch().then(() => {
                  notificationManager.SUCCESS("Table Refreshed");
                })
              }
              isLoading={isLoading || isFetching}
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
  );
}

const Outer = styled.div`
  max-width: 700px;
  max-height: calc(100vh - 70px);
  overflow: auto;
  width: 100%;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 5px;
  padding: 40px 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.textPrimary};
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 10px;
  text-align: left;
`;

const InfoBox = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  & p {
    /* background-color: ${({ theme }) => theme.primary}; */
    border-bottom: 1px solid ${({ theme }) => theme.primary};
    /* border-radius: 5px; */
    padding: 5px;
    display: flex;
    width: 100%;
    font-size: 14px;
  }
`;

const Label = styled.span`
  display: flex;
  font-weight: 600;
  margin-right: 5px;
`;

const LastUpdate = styled.p`
  margin-top: 10px;
  font-size: 12px;
`;

const FullyRefunded = styled.p`
  display: flex;
  width: 100%;
  font-size: 20px;
  padding: 10px;
  justify-content: center;
  text-align: center;
  align-items: center;
  color: #42ff42;
  text-transform: uppercase;
  font-weight: 700;
`;

export const RefundActionModal = ({ transaction }) => {
  const [amount, setAmount] = useState(
    transaction.processed_amount - (transaction.refund_amount || 0)
  );
  const [selectedBrand] = useSelectedBrand();
  const notify = useNotification();
  const queryClient = useQueryClient();
  const updateRefund = useMutation(
    ({ transaction_id, refundAmount }) =>
      agent().updateRefundAmount(transaction_id, refundAmount),
    {
      onSuccess: () => {
        notify.SUCCESS("Refund amount updated");
        queryClient.invalidateQueries([selectedBrand, "userFinances"]);
      },
      onError: () => {
        notify.ERROR("Error updating refund amount");
      },
    }
  );

  const currencyFormatter = (currency, amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };
  return (
    <Outer>
      <Title>Set Refund Amount</Title>
      <InfoBox>
        <p>
          <Label>Deposited: </Label>
          {`${currencyFormatter(
            transaction.processed_currency,
            transaction.processed_amount
          )}`}
        </p>

        <p>
          <Label>Current Refund Total: </Label>
          {`${currencyFormatter(
            transaction.processed_currency,
            transaction.refund_amount || 0
          )}`}
        </p>
        <p>
          <Label>Available Refund Amount: </Label>
          {`${currencyFormatter(
            transaction.processed_currency,
            transaction.processed_amount - (transaction.refund_amount || 0)
          )}
          `}
        </p>
      </InfoBox>
      {transaction.processed_amount === transaction.refund_amount && (
        <FullyRefunded>Transaction fully refunded</FullyRefunded>
      )}
      <NumberInputDos
        value={amount}
        onChange={(e) => {
          setAmount(+e.target.value);
        }}
      />
      <ActionButton
        invert
        onClick={() => {
          updateRefund.mutate({
            transaction_id: transaction._id,
            refundAmount: amount,
          });
        }}
      >
        Update
      </ActionButton>
      <LastUpdate>
        {`Last update at: ${DateTime.fromISO(transaction?.updatedAt).toFormat(
          "dd/MM/yyyy - HH:mm"
        )}`}
      </LastUpdate>
    </Outer>
  );
};

export default FinancesDetails;
