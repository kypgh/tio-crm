import React from "react";
import styled from "styled-components";
import DailyAnalysisResults from "./DailyAnalysisResults";

const DailyAnalysisContainer = styled.div`
  background-color: transparent;
`;

const ExpandIconContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.textPrimary};
  border-radius: 5px;
`;

const DailyAnalysisHeader = styled.div`
  width: 100%;
  padding: 2px;
  color: ${({ theme }) => theme.textPrimary};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px 5px 0px 0px;
  border: 5px solid ${({ theme }) => theme.primary};
  gap: 2px;
  justify-content: stretch;
  align-items: stretch;
  width: 100%;
  text-align: start;
  display: grid;
  grid-template-columns: 50px 4fr auto;
  & > * {
    background-color: ${({ theme }) => theme.secondary};
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 8px;
    overflow: hidden;
  }
  & > :first-child {
    justify-content: center;
  }

  & > :last-child,
  & > :nth-last-child(2) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    grid-template-columns: 2fr 2fr 2fr;
  }
`;

const DailyAnalysis = () => {
  return (
    <DailyAnalysisContainer>
      <DailyAnalysisHeader>
        <div></div>
        <div>
          <h3>Daily Analysis</h3>
        </div>
      </DailyAnalysisHeader>
      <DailyAnalysisResults />
    </DailyAnalysisContainer>
  );
};

export default DailyAnalysis;
