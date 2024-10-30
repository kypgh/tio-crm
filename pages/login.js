import { useState, useEffect } from "react";
import styled from "styled-components";
import { IoMdSunny, IoMdMoon } from "react-icons/io";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Formik } from "formik";

import { Lottie } from "../components/Lottie";
import loadingAnimation from "../public/assets/animations/tioLoader.json";
import { colors } from "../config/colors";
import agent, { setJWTToken } from "../utils/agent";
import { setCookie, getCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import useTheme from "../utils/hooks/useTheme";
import Logo from "../components/Logo";
import useSelectedBrand from "../utils/hooks/useSelectedBrand";
//
const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.primary};
  position: relative;
  padding: 15px;
  flex-direction: column;
  transition: 0.3s all ease;
`;

const Box = styled.div`
  gap: 15px;
  padding: 20px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 10px;
  min-width: 300px;
  max-width: 400px;
  width: 100%;
  transition: 0.3s all ease;
  position: relative;

  & form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    width: 100%;
    transition: 0.3s all ease;
  }
`;

const InputField = styled.input`
  background-color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.white};
  font-size: 1rem;
  padding: 10px;
  width: 100%;
  transition: 0.3s all ease;

  &:focus-visible {
    outline: none;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.textPrimary};
  text-align: left;
  margin-bottom: 20px;
  transition: 0.3s all ease;
  opacity: 0.4;
`;

const Label = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  align-self: flex-start;
  transition: 0.3s all ease;
`;

const ThemeContainer = styled.div`
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
  transition: 0.3s all ease;

  svg {
    color: ${({ theme }) => theme.textSecondary};
    transition: 0.3s all ease;
  }
  &:hover svg {
    color: ${({ theme }) => theme.white};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.brand};
  color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  border: 1px solid ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: 0.3s all ease;
  width: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    border: 1px solid ${({ theme }) => theme.brand};
    color: ${({ theme }) => theme.brand};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    color: ${({ theme }) => theme.black};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.errorMsg};
  align-self: flex-start;
`;

const LoadingBox = styled.div`
  position: absolute;
  top: 0;
  border-radius: 5px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #111111f5;
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    & path {
      fill: ${({ theme }) => theme.brand};
    }
  }
`;

const CopyrightLine = styled.div`
  width: 100%;
  padding: 15px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.brand};
  font-weight: 700;
  font-size: 12px;
  opacity: 0.6;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;

function Login({ requestedPage = "/" }) {
  const { theme, setDark, setLight } = useTheme();
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().required().label("Email"),
    password: Yup.string().required().label("Password"),
  });

  const [selectedBrand, setBrand] = useSelectedBrand();

  const queryClient = useQueryClient();

  const [loginErrorMsg, setLoginErrorMsg] = useState(false);
  const [hasToken, setHasToken] = useState(true);

  const router = useRouter();

  useEffect(() => {
    let rToken = getCookie("refresh_token");
    if (rToken) {
      agent()
        .refreshAccessToken(rToken)
        .then((res) => {
          let query = { ...router.query };
          delete query.redirect;
          queryClient.invalidateQueries(["currentUser"]);
          return router.push({
            pathname: requestedPage,
            query,
          });
        })
        .catch((err) => {
          setJWTToken("");
          setCookie("refresh_token", "", { sameSite: "lax" });
          setHasToken(false);
          console.error(err);
          queryClient.invalidateQueries(["currentUser"]);
        });
    } else {
      setHasToken(false);
    }
  }, []);

  return (
    <Outer>
      <Logo
        width={120 + 80}
        height={30 + 80}
        primaryColor={theme.brand}
        secondaryColor={theme.logoSecondary}
      />
      <Box>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validateOnChange={false}
          validationSchema={loginValidationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            return agent()
              .loginCrmUser(values.email, values.password)
              .then((res) => {
                const { user = {} } = res;
                let query = { ...router.query };
                delete query.redirect;
                setBrand(user.brands[0]);

                return router.push({
                  pathname: requestedPage,
                  query,
                });
              })
              .catch(() => {
                setLoginErrorMsg(true);
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({ handleSubmit, isSubmitting, errors, setFieldValue }) => (
            <>
              {(isSubmitting || hasToken) && (
                <LoadingBox>
                  <Lottie
                    animationData={loadingAnimation}
                    mBottom="0"
                    autoPlay={true}
                    loop={true}
                    width={100}
                    height={100}
                  />
                </LoadingBox>
              )}
              <form onSubmit={(ev) => ev.preventDefault()}>
                <Title>Login</Title>
                <Label>Email:</Label>
                <InputField
                  type="email"
                  name="email"
                  autoComplete="username"
                  onChange={(e) => {
                    setFieldValue("email", e.target.value);
                    setLoginErrorMsg(false);
                  }}
                />
                <ErrorMessage>{errors.email}</ErrorMessage>
                <Label>Password:</Label>
                <InputField
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  onChange={(e) => {
                    setFieldValue("password", e.target.value);
                    setLoginErrorMsg(false);
                  }}
                />
                <ErrorMessage>{errors.password}</ErrorMessage>
                <ButtonContainer>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    Login
                  </Button>
                </ButtonContainer>
                {loginErrorMsg && (
                  <ErrorMessage style={{ alignSelf: "center" }}>
                    Wrong Credentials
                  </ErrorMessage>
                )}
              </form>
            </>
          )}
        </Formik>
      </Box>
      <ThemeContainer>
        {theme.name !== "light" ? (
          <IoMdSunny size={18} onClick={setLight} />
        ) : (
          <IoMdMoon size={18} onClick={setDark} />
        )}
      </ThemeContainer>
      <CopyrightLine>
        {`©${new Date().getFullYear()} Flo CRM. All Rights Reserved.`}
      </CopyrightLine>
    </Outer>
  );
}
export default Login;

export async function getServerSideProps(context) {
  const { redirect } = context.query;

  return {
    props: {
      requestedPage: redirect ?? "/",
    },
  };
}
