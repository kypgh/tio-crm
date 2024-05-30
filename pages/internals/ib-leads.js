import React from "react";
import { PageOuter, Title } from "../../components/generic";
import ManageUser from "../../components/ibLeads/ManageUser";

const IbLeads = () => {
  return (
    <PageOuter>
      <Title>IB Leads Management</Title>
      {/* {process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ? (
        <Warn>This page only works in production (one server)</Warn>
      ) : (
        <></>
      )} */}
      <ManageUser />
    </PageOuter>
  );
};

export default IbLeads;

export async function getStaticProps() {
  return {
    props: {},
  };
}
