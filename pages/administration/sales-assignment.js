import React from "react";

import { PageOuter, Title } from "../../components/generic";
import SalesAssignmentTable from "../../components/tableComponents/SalesAssignmentTable";

const SalesAssignment = () => {
  return (
    <PageOuter>
      <Title>Sales Assignment</Title>
      <SalesAssignmentTable />
    </PageOuter>
  );
};

export default SalesAssignment;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
