import React from "react";
import { PageOuter, Title } from "../../components/generic";
import styled from "styled-components";

const ReportHolder = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  &::after {
    position: absolute;
    content: "";
    /* opacity: 0; */
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 25px;
    background: #1c252c;
  }
`;

const ReportIframe = styled.iframe`
  /* width: 1530px; */
  width: 100%;
  max-width: calc(100% - 150px);
  /* height: 890px; */
  height: 100%;
  min-height: calc(100vh - 155px);
  border: 0;
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
`;

const analytics = () => {
  return (
    <PageOuter>
      <Title>Analytics</Title>
      <ReportHolder>
        <ReportIframe
          src="https://datastudio.google.com/embed/reporting/fe2e7f13-be3e-45f0-8a7a-7ddb395ecdac/page/huC4C"
          allowFullscreen
        ></ReportIframe>
      </ReportHolder>
    </PageOuter>
  );
};

export default analytics;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
