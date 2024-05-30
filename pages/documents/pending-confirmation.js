import React from "react";

import { PageOuter, Title } from "../../components/generic";
import DocumentsTable from "../../components/tableComponents/DocumentsTable";

function Documents() {
  return (
    <PageOuter>
      <Title>DOCUMENTS</Title>
      <DocumentsTable status={"pendingChanges"} />
    </PageOuter>
  );
}

export default Documents;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
