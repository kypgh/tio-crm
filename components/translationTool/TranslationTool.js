import React, { useState } from "react";
import JSONViewer from "../common/JSONViewer";
import TranslationApps from "./TranslationApps";
import styled from "styled-components";
import {
  useTranslationAppById,
  useTranslationKeys,
} from "../../utils/hooks/translationHooks";
import { useRouter } from "next/router";
import { Loader } from "../generic";
import { useNotification } from "../actionNotification/NotificationProvider";
import TranslationJSON from "./TranslationJSON";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: calc(100% - 80px);
  gap: 20px;
`;

const Inner = styled.div`
  position: relative;
  overflow: hidden;
`;

const NoAppSelected = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.textPrimary};
`;

const TranslationTool = () => {
  const router = useRouter();
  const translationApp = useTranslationAppById(router.query.app);
  const { data, isLoading, isFetching } = useTranslationKeys(
    router.query.app,
    router.query.lang ?? "en"
  );
  return (
    <Container>
      <TranslationApps />
      <Inner>
        {router.query.app ? (
          <>
            {(isLoading || translationApp.isLoading || isFetching) && (
              <Loader />
            )}
            <TranslationJSON data={data ?? {}} app={translationApp.data} />
          </>
        ) : (
          <NoAppSelected>Please select an app</NoAppSelected>
        )}
      </Inner>
    </Container>
  );
};

export default TranslationTool;
