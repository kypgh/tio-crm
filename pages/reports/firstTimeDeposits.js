import React from "react";
import { PageOuter, Title } from "../../components/generic";
import FirstTimeDepositsTable from "../../components/tableComponents/FirstTimeDepositsTable";
import Head from "next/head";

const FirstTimeDeposits = () => {
  return (
    <>
      <Head>
        <title>Flo CRM |First Time Deposits</title>
      </Head>
      <PageOuter>
        <Title>First Time Deposits</Title>
        <FirstTimeDepositsTable />
      </PageOuter>
    </>
  );
};

export default FirstTimeDeposits;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
