import React from "react";
import { PageOuter, Title } from "../../components/generic";
import LogsViewer from "../../components/administration/LogsViewer";

const logs = () => {
  return (
    <PageOuter>
      <Title>LOGS</Title>
      <LogsViewer />
    </PageOuter>
  );
};

export default logs;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
