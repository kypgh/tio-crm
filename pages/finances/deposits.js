import React from "react";

import { PageOuter, Title } from "../../components/generic";
import DepositsTable from "../../components/tableComponents/DepositsTable";

function Deposits() {
  return (
    <PageOuter>
      <Title>Deposits</Title>
      <DepositsTable />
    </PageOuter>
  );
}

export default Deposits;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
