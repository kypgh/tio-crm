import React from "react";
import { PageOuter, Title } from "../../components/generic";
import FinancesTable from "../../components/tableComponents/FinancesTable";
import Head from "next/head";

const Finances = () => {
  return (
    <>
      <Head>
        <title>Flo CRM | Finances</title>
      </Head>
      <PageOuter>
        <Title>Finances</Title>
        <FinancesTable />
      </PageOuter>
    </>
  );
};

export default Finances;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
