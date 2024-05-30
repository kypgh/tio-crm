import Head from "next/head";
import React from "react";
import { PageOuter, Title } from "../../components/generic";
import BalanceReportTable from "../../components/tableComponents/BalanceReportTable";

const balanceEquity = () => {
  return (
    <>
      <Head>
        <title>Flo CRM | Balance/Equity Report</title>
      </Head>
      <PageOuter>
        <Title>Balance/Equity Report</Title>
        <BalanceReportTable />
      </PageOuter>
    </>
  );
};

export default balanceEquity;
