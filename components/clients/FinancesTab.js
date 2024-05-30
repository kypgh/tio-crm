import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { useTransactions } from "../../utils/hooks/serverHooks";
import useSelectedBrand from "../../utils/hooks/useSelectedBrand";
import EmptyBoundary from "../EmptyBoundary";
import { Checkbox } from "../formComponents/FormGeneric";
import { ButtonBlue, CenteredTypography, Loader, Refresh } from "../generic";
import DatesTransactions from "./DatesTransactions";
import FinancesDetails from "./FinancesDetails";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow: hidden;
`;

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.primary};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.brand};
    border-radius: 50px;
  }
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CusLabel = styled.label`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 700;
  cursor: pointer;
`;

const HintText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  & > span {
    text-decoration: underline;
  }
`;

export default function FinancesTab({ user }) {
  const queryClient = useQueryClient();
  const [dates, setDates] = useState();
  const [activeTab, setActiveTab] = useState("detailed");

  const [showDeposit, setShowDeposit] = useState(true);
  const [showWithdrawal, setShowWithdrawal] = useState(true);
  const [transactionType, setTransactionType] = useState(null);

  const [selectedBrand] = useSelectedBrand();

  const { data, isLoading, isFetching, error, refetch } = useTransactions(
    1,
    50,
    user._id,
    transactionType
  );
  useEffect(() => {
    if (data?.newDocs) {
      const { newDocs } = data;
      setDates(Object.keys(newDocs));
    }
  }, [data]);

  useEffect(() => {
    if (!showDeposit && !showWithdrawal) return;
    if (showDeposit && showWithdrawal) {
      setTransactionType(null);
    }
    if (showDeposit && !showWithdrawal) {
      setTransactionType("deposit");
    }
    if (!showDeposit && showWithdrawal) {
      setTransactionType("withdrawal");
    }
  }, [showDeposit, showWithdrawal]);

  useEffect(() => {
    refetch();
  }, [transactionType]);

  if (error) {
    return (
      <Outer>
        <Refresh
          onClick={() =>
            queryClient.invalidateQueries([selectedBrand, "transactions"])
          }
        />
        <CenteredTypography>Something went wrong.</CenteredTypography>
      </Outer>
    );
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <Outer>
      <TopContainer>
        <TabsContainer>
          <ButtonBlue
            active={activeTab === "summary"}
            onClick={() => {
              setActiveTab("summary");
            }}
          >
            Summary
          </ButtonBlue>
          <ButtonBlue
            active={activeTab === "detailed"}
            onClick={() => {
              setActiveTab("detailed");
            }}
          >
            Detailed
          </ButtonBlue>
          {activeTab === "summary" ? (
            <>
              <Checkbox
                checked={showDeposit}
                invert
                id="deposits"
                onChange={() => setShowDeposit(!showDeposit)}
              />
              <CusLabel htmlFor="deposits">Deposits</CusLabel>
              <Checkbox
                checked={showWithdrawal}
                invert
                id={"withdrawal"}
                onChange={() => setShowWithdrawal(!showWithdrawal)}
              />
              <CusLabel htmlFor="withdrawal">Withdrawals</CusLabel>
            </>
          ) : (
            // <HintText>
            //   Hint: <span>scroll wheel</span> is vertical scroll but{" "}
            //   <span>shift + scroll wheel</span> is horizontal scroll
            // </HintText>
            <></>
          )}
        </TabsContainer>
        <Refresh
          onClick={() =>
            queryClient.invalidateQueries([selectedBrand, "transactions"])
          }
        />
      </TopContainer>
      {/* {(isLoading || isFetching) && <Loader />} */}

      <Inner>
        <EmptyBoundary isEmpty={data.docs.length === 0}>
          {activeTab === "summary" && (
            <Summary>
              {data.docs &&
                data.docs.length > 0 &&
                dates &&
                dates.map((date, index) => (
                  <DatesTransactions key={index} data={data} date={date} />
                ))}
            </Summary>
          )}
          {activeTab === "detailed" && (
            <FinancesDetails data={data} user={user} />
          )}
        </EmptyBoundary>
      </Inner>
    </Outer>
  );
}
