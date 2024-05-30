import React from "react";
import { PageOuter, Title } from "../../components/generic";
import UpdateClientInfo from "../../components/openPayd/UpdateClientInfo";
import styled from "styled-components";
const Warn = styled.small`
  color: red;
`;
const Finances = () => {
  return (
    <PageOuter>
      <Title>OpenPayd | Client Details Form</Title>
      {process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ? (
        <Warn>This page only works in production (one server)</Warn>
      ) : (
        <UpdateClientInfo />
      )}
    </PageOuter>
  );
};

export default Finances;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
