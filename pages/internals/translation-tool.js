import React from "react";
import { PageOuter, Title } from "../../components/generic";
import TranslationTool from "../../components/translationTool/TranslationTool";
import styled from "styled-components";

const Finances = () => {
  return (
    <PageOuter>
      <Title>Translation Tool</Title>
      {/* {process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ? (
        <Warn>This page only works in production (one server)</Warn>
      ) : (
        <TranslationTool />
      )} */}
      <TranslationTool />
    </PageOuter>
  );
};

export default Finances;

export async function getStaticProps(context) {
  return {
    props: {},
  };
}
