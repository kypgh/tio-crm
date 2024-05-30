import React from "react";

import { Title, PageOuter } from "../../components/generic";
import CrmTable from "../../components/tableComponents/CrmTable";
import PCR from "../../components/PCR";

function Users() {
  return (
    <PageOuter>
      <Title>CRM Users</Title>
      <PCR.getCrmUsers>
        <CrmTable />
      </PCR.getCrmUsers>
    </PageOuter>
  );
}

export default Users;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
