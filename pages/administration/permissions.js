import React from "react";

import CrmUsersPermissionsTable from "../../components/tableComponents/CrmUsersPermissionsTable";
import { Title, PageOuter } from "../../components/generic";

const Permissions = () => {
  return (
    <PageOuter>
      <Title>Roles & Permissions</Title>
      <CrmUsersPermissionsTable />
    </PageOuter>
  );
};

export default Permissions;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
