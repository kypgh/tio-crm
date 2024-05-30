import React from "react";

import { PageOuter, Title } from "../../components/generic";
import WithdrawalsTable from "../../components/tableComponents/WithdrawalsTable";

function Withdrawals() {
  return (
    <PageOuter>
      <Title>Withdrawals</Title>
      <WithdrawalsTable />
    </PageOuter>
  );
}

export default Withdrawals;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
