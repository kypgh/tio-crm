import React from "react";
import { PageOuter, Title } from "../../components/generic";
import SweepFrom from "../../components/openPayd/SweepFrom";
import styled from "styled-components";
const Warn = styled.small`
  color: red;
`;
const OpenpaydSweep = () => {
  return (
    <PageOuter>
      <Title>OpenPayd | Sweep</Title>
      {process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ? (
        <Warn>This page only works in production (one server)</Warn>
      ) : (
        <SweepFrom />
      )}
    </PageOuter>
  );
};

export default OpenpaydSweep;
