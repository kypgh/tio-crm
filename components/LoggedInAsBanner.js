import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import styled from "styled-components";
import useTheme from "../utils/hooks/useTheme";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { setJWTToken } from "../utils/agent";

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textSecondary};
  padding: 5px 10px;
  border-top-left-radius: 5px;

  transition: transform 0.3s ease;
  transform: scaleY(0);
  transform-origin: bottom;

  &.visible {
    transform: scaleY(1);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  user-select: none;
  z-index: 100;
`;

const Btn = styled.button`
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.textPrimary};
  outline: none;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.secondaryFaded};
  }
`;

const LoggedInAsBanner = () => {
  const [is3rdView, setIs3rdView] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  useEffect(() => {
    function checkCookie() {
      const loggedInAs = getCookie("loggedInAs");
      const loggedInUserName = getCookie("loggedinuser");
      setLoggedInUser(loggedInUserName);
      setIs3rdView(!!loggedInAs);
    }
    window.setInterval(checkCookie, 5000);
    return () => window.clearInterval(checkCookie);
  }, []);

  function exit3rdView() {
    const loggedInAs = getCookie("loggedInAs");
    if (loggedInAs) {
      const originalRToken = getCookie("original_user_refresh_token");
      setCookie("refresh_token", originalRToken, { sameSite: "lax" });
      setCookie("loggedInAs", "", { sameSite: "lax" });
      setCookie("original_user_refresh_token", "", { sameSite: "lax" });
      setJWTToken("");
      queryClient.invalidateQueries([]);
      setIs3rdView(false);
      router.push("/");
    }
  }

  return (
    <Container className={is3rdView ? "visible" : ""}>
      <FaExclamationTriangle color={theme.pendingColor} />
      <span>{`Viewing CRM as ${loggedInUser}`}</span>
      <Btn onClick={exit3rdView}>Exit View</Btn>
    </Container>
  );
};

export default LoggedInAsBanner;
