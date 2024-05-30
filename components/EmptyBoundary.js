import React from "react";
import styled from "styled-components";
import { Lottie } from "./Lottie";
import emptyBoundary from "../public/assets/animations/emptyboundary.json";

const EmptyDiv = styled.div`
  width: 100%;
  /* height: 100%; */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-wrap: wrap;
`;

const EmptyTypography = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.brand};
  width: 100%;
`;

const EmptyBoundary = ({
  children,
  isEmpty,
  message = "No Records Found",
  size = 120,
}) => {
  if (isEmpty)
    return (
      <EmptyDiv>
        <Lottie
          animationData={emptyBoundary}
          width={160}
          height={size}
          autoPlay={true}
          loop={true}
          style={{
            marginTop: 20,
            opacity: 0.8,
          }}
        />
        <EmptyTypography>{message}</EmptyTypography>
      </EmptyDiv>
    );
  return children;
};

export default EmptyBoundary;
