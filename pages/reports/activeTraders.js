import React from "react";
import { PageOuter, Title } from "../../components/generic";
import ActiveTradersTable from "../../components/tableComponents/ActiveTradersTable";
import Head from "next/head";

const ActiveTraders = () => {
  return (
    <>
      <Head>
        <title>Flo CRM | Active Traders</title>
      </Head>
      <PageOuter>
        <Title>Active traders</Title>
        <ActiveTradersTable />
      </PageOuter>
    </>
  );
};

export default ActiveTraders;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
