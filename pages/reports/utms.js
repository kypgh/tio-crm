import React from "react";
import { PageOuter, Title } from "../../components/generic";
import Head from "next/head";
import UtmsTable from "../../components/tableComponents/UtmsTable";

const Utms = () => {
  return (
    <>
      <Head>
        <title>Flo CRM | UTM Reports</title>
      </Head>
      <PageOuter>
        <Title>UTM Reports</Title>
        <UtmsTable />
      </PageOuter>
    </>
  );
};

export default Utms;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
