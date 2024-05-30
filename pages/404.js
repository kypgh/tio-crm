import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PageOuter, Title } from "../components/generic";
import { colors } from "../config/colors";

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

const MainText = styled.h3`
  color: ${({ theme }) => theme.textPrimary};
`;

const CountdownText = styled.p`
  color: ${({ theme }) => theme.textPrimary};
`;

const Custom404 = () => {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    let count = countdown;
    let interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else if (count === 0) {
        setCountdown(0);
        router.push("/");
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <PageOuter>
      <CenteredContainer>
        <Title>404</Title>
        <MainText>Page Not Found</MainText>
        <CountdownText>Redirecting to main page in {countdown}</CountdownText>
      </CenteredContainer>
    </PageOuter>
  );
};

export default Custom404;
