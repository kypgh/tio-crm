import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { BsFillCalendarFill } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import styled from "styled-components";
import ChartInfoBox from "../components/dashboard/ChartInfoBox";
import InfoBox from "../components/dashboard/InfoBox";
import { PageOuter, Title } from "../components/generic";

import { useRouter } from "next/router";
import PCR from "../components/PCR";
import { useNotification } from "../components/actionNotification/NotificationProvider";
import HcDonut from "../components/charts/HcDonut";
import PolarChart from "../components/charts/PolarChart";
import LatestRegistrationsTable from "../components/tableComponents/LatestClientsTable";
import LatestTransactionsTable from "../components/tableComponents/LatestTransactionsTable";
import {
  useDailyTransactionsForThisMonth,
  useUsersPerCountry,
  useUsersPerDevice,
  useUsersPerTimeframe,
} from "../utils/hooks/serverHooks";

const Container = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 460px 500px;
  gap: 10px;
`;

const InfoBoxOuter = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
`;
//
function Dashboard() {
  const router = useRouter();
  const notification = useNotification();

  useEffect(() => {
    if (router.query.error === "404") {
      notification.ERROR("Page not found");
      router.replace("/", undefined, { shallow: true });
    } else if (router.query.error === "401") {
      notification.ERROR("Access denied");
      router.replace("/", undefined, { shallow: true });
    } else if (router.query.error === "500") {
      notification.ERROR("An error occured");
      router.replace("/", undefined, { shallow: true });
    }
  }, [router.query]);

  const { data: usersPerDevice } = useUsersPerDevice({
    refetchOnWindowFocus: false,
    initialData: {
      android: 3,
      ios: 4,
      windows: 3,
    },
  });

  const { data: usersPerCountry } = useUsersPerCountry({
    refetchOnWindowFocus: false,
    initialData: {
      US: 5,
      CA: 3,
      UK: 2,
      AU: 4,
    },
  });

  const { data: usersPerTimeframe } = useUsersPerTimeframe({
    refetchOnWindowFocus: false,
    initialData: {
      totalUsers: 1500,
      todayUsers: 25,
      weeklyUsers: 100,
      monthlyUsers: 400,
      monthlyFTDs: 50,
    },
  });

  const dailyTransactions = useDailyTransactionsForThisMonth({
    refetchOnWindowFocus: false,
    initialData: {
      total_deposits_amount: "45000.00",
      total_withdrawals_amount: "27000.00",
      deposits_performance_increase: 15.5,
      withdrawals_performance_increase: -5,
      daily_transactions_month_format: {
        labels: [
          "2024-10-01",
          "2024-10-02",
          "2024-10-03",
          "2024-10-04",
          "2024-10-31",
        ],
        deposits: [12, 15, 10, 8, 14],
        withdrawals: [8, 9, 5, 7, 9],
        deposit_amounts: [
          "1800.00",
          "2250.00",
          "1500.00",
          "1200.00",
          "2100.00",
        ],
        withdrawal_amounts: [
          "1200.00",
          "1350.00",
          "750.00",
          "1050.00",
          "1350.00",
        ],
      },
    },
  });

  const col = {
    android: "#a4c639",
    ios: "#dfdfdf",
    windows: "#0D62EF",
  };

  const polarChartUsersPerDeviceData = Object.keys(usersPerDevice)
    .map((x) => {
      return { name: x, count: usersPerDevice[x], color: col[x] };
    })
    .sort((a, b) => b.count - a.count);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const sortedUsersPerCountry = useMemo(() => {
    return Object.entries(usersPerCountry).sort((a, b) => b[1] - a[1]);
  }, [usersPerCountry]);

  return (
    <>
      <Head>
        <title>Flo CRM | Dashboard</title>
      </Head>
      <PageOuter>
        <Title>DASHBOARD</Title>
        <InfoBoxOuter>
          <InfoBox
            title="This month's FTDs"
            style={{ gridColumn: "span 2" }}
            data={usersPerTimeframe?.monthlyFTDs}
            icon={<HiUserGroup />}
          />
          <PCR.usersPerTimeframe>
            <InfoBox
              title="Today's Registrations"
              style={{ gridColumn: "span 2" }}
              data={usersPerTimeframe?.todayUsers}
              icon={<BsFillCalendarFill />}
              extra={new Date().getDate()}
            />
            <InfoBox
              title="This Months's Clients"
              style={{ gridColumn: "span 2" }}
              data={usersPerTimeframe?.monthlyUsers}
              icon={<BsFillCalendarFill />}
              extra={new Intl.DateTimeFormat("en-GB", {
                month: "short",
              }).format(new Date())}
            />
          </PCR.usersPerTimeframe>
          <PCR.usersTransactionsPerMonth>
            <ChartInfoBox
              isLoading={dailyTransactions.isLoading}
              style={{ gridColumn: "span 3" }}
              title="This Month's Deposits"
              data={currencyFormatter.format(
                dailyTransactions.data?.total_deposits_amount || 0
              )}
              percentIncrease={
                dailyTransactions.data?.deposits_performance_increase
              }
              chartData={
                dailyTransactions.data?.daily_transactions_month_format
                  ?.deposit_amounts
              }
              chartLabels={
                dailyTransactions.data?.daily_transactions_month_format?.labels
              }
            />
            <ChartInfoBox
              isLoading={dailyTransactions.isLoading}
              style={{ gridColumn: "span 3" }}
              title="This Month's Withdrawals"
              data={currencyFormatter.format(
                dailyTransactions.data?.total_withdrawals_amount || 0
              )}
              percentIncrease={
                dailyTransactions.data?.withdrawals_performance_increase
              }
              chartData={
                dailyTransactions.data?.daily_transactions_month_format
                  ?.withdrawal_amounts
              }
              chartLabels={
                dailyTransactions.data?.daily_transactions_month_format?.labels
              }
            />
          </PCR.usersTransactionsPerMonth>
        </InfoBoxOuter>
        <Container>
          <LatestRegistrationsTable miniTitle="Latest Registrations" />
          <PCR.viewTransactions>
            <LatestTransactionsTable miniTitle="Latest Transactions" />
          </PCR.viewTransactions>
          <PCR.usersPerDevice>
            <PolarChart
              chartData={[...polarChartUsersPerDeviceData.map((x) => x.count)]}
              labelData={[...polarChartUsersPerDeviceData.map((x) => x.name)]}
              chartTitle="Registrations by device"
              colorsArr={[...polarChartUsersPerDeviceData.map((x) => x.color)]}
            />
          </PCR.usersPerDevice>
          <PCR.usersPerCountry>
            {sortedUsersPerCountry.length > 0 && (
              <HcDonut
                chartTitle="Registrations by Continent - Country"
                userCountryData={sortedUsersPerCountry}
              />
            )}
          </PCR.usersPerCountry>
        </Container>
      </PageOuter>
    </>
  );
}

export default Dashboard;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
