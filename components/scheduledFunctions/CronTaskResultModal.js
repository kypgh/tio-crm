import { DateTime } from "luxon";

import React from "react";
import { JSONTree } from "react-json-tree";
import styled, { useTheme } from "styled-components";
import { FormTitle } from "../formComponents/FormGeneric";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-height: 150px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 3px;
  padding: 10px;
  position: relative;
  max-width: 700px;
  position: relative;
  color: ${({ theme }) => theme.white};
`;

const TopInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: small;
  color: ${({ theme }) => theme.textSecondary};
`;

const StatusText = styled.p`
  border-bottom: 1px solid
    ${({ theme, status }) =>
      status === "SUCCESS" ? theme.success : theme.errorMsg};
`;

const ResultContainer = styled.div`
  & > * {
    padding: 10px !important;
    border-radius: 5px;
    max-height: 500px;
    overflow-y: auto;
  }
`;

const JSONTreeTheme = {
  scheme: "atelier forest",
  author:
    "bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/forest)",
  base00: "#1b1918",
  base01: "#2c2421",
  base02: "#68615e",
  base03: "#766e6b",
  base04: "#9c9491",
  base05: "#a8a19f",
  base06: "#e6e2e0",
  base07: "#f1efee",
  base08: "#f22c40",
  base09: "#df5320",
  base0A: "#d5911a",
  base0B: "#5ab738",
  base0C: "#00ad9c",
  base0D: "#407ee7",
  base0E: "#6666ea",
  base0F: "#c33ff3",
};

const CronTaskResultModal = ({ modalData, closeModal }) => {
  const theme = useTheme();
  return (
    <Outer>
      <TopInfoRow>
        <p>
          {DateTime.fromISO(modalData.createdAt).toFormat(
            "dd/MM/yyyy - HH:mm:ss"
          )}
        </p>
        <StatusText status={modalData.status}>{modalData.status}</StatusText>
      </TopInfoRow>
      <FormTitle>Task result</FormTitle>
      <ResultContainer>
        <JSONTree
          data={modalData.result}
          theme={JSONTreeTheme}
          invertTheme={theme.name == "light"}
        />
      </ResultContainer>
    </Outer>
  );
};

export default CronTaskResultModal;
