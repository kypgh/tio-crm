import React from "react";

import { PageOuter, Title } from "../../components/generic";
import DepositRequestsTables from "../../components/tableComponents/DepositRequestsTable";

const PendingDeposits = () => {
  return (
    <PageOuter>
      <Title>Pending Deposits</Title>
      <DepositRequestsTables />
    </PageOuter>
  );
};

export default PendingDeposits;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
