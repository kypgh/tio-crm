import React from "react";
import { PageOuter, Title } from "../../components/generic";
import DailyAnalysis from "../../components/dailyAnalysis/DailyAnalysis";
import styled from "styled-components";

const Warn = styled.small`
  color: red;
`;

const ScheduledFunctions = () => {
  return (
    <PageOuter>
      <Title>Daily Analysis</Title>
      {process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ? (
        <Warn>This page only works in production (one server)</Warn>
      ) : (
        <DailyAnalysis />
      )}
    </PageOuter>
  );
};

export default ScheduledFunctions;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
