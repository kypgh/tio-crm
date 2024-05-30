import React from "react";
import { PageOuter, Title } from "../../components/generic";
import ScheduledFunctionsList from "../../components/scheduledFunctions/ScheduledFunctionsList";

const ScheduledFunctions = () => {
  return (
    <PageOuter>
      <Title>Scheduled Functions</Title>
      <ScheduledFunctionsList></ScheduledFunctionsList>
    </PageOuter>
  );
};

export default ScheduledFunctions;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
