import React from "react";
import styled from "styled-components";

const ErrorDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorTypography = styled.div`
  color: ${({ theme }) => theme.errorMsg};
`;

export default function ErrorBoundary({ hasError, errorMessage, children }) {
  if (hasError) {
    return (
      <ErrorDiv>
        <ErrorTypography>
          {errorMessage || "Something went wrong"}
        </ErrorTypography>
      </ErrorDiv>
    );
  }
  return children;
}
