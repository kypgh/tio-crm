import React from "react";

import { PageOuter, Title } from "../../components/generic";
import WithdrawalRequestsTables from "../../components/tableComponents/WithdrawalRequestsTables";

const PendingWithdrawals = () => {
  return (
    <PageOuter>
      <Title>Pending Withdrawals</Title>
      <WithdrawalRequestsTables />
    </PageOuter>
  );
};

export default PendingWithdrawals;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
