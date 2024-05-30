import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import "../styles/global.css";
import "../styles/nprogress.css";
import DefaultLayout from "../components/layouts/DefaultLayout";
import NotificationProvider from "../components/actionNotification/NotificationProvider";
import useRouteLoader from "../utils/hooks/useRouteLoader";
import useServiceWorker from "../utils/hooks/useServiceWorker";
import { ThemeProvider } from "../utils/hooks/useTheme";
import { BrandProvider } from "../utils/hooks/useSelectedBrand";
import { createGlobalStyle } from "styled-components";
import LoggedInAsBanner from "../components/LoggedInAsBanner";
import useFieldsLocalStorage from "../utils/hooks/useFieldsLocalStorage";
//test
const GlobalStyle = createGlobalStyle`
body::-webkit-scrollbar-thumb {
  background: ${({ theme }) => theme.brand};
  border-radius: 50px;
}

#nprogress{
  & .peg{
     box-shadow: 0 0 10px ${({ theme }) => theme.brand}, 0 0 5px ${({
  theme,
}) => theme.brand};
  }
& .bar{
  background: ${({ theme }) => theme.brand};
    box-shadow: 0 0 10px ${({ theme }) => theme.brand}, 0 0 5px ${({ theme }) =>
  theme.brand};
}
& .spinner-icon{
  border-top-color: ${({ theme }) => theme.brand};
  border-left-color: ${({ theme }) => theme.brand};
} 
 }
`;

function MyApp({ Component, pageProps }) {
  const { route, pathname, query, replace, events } = useRouter();

  const [_, setField] = useFieldsLocalStorage();

  useEffect(() => {
    if (query.hasOwnProperty("fields")) {
      delete query["fields"];
      replace({ pathname, query }, undefined, {
        shallow: true,
      });
    }

    let newFields = localStorage.getItem(`${pathname}-fields`);
    if (newFields) {
      setField(JSON.parse(newFields));
    }
  }, [pathname]);

  useEffect(() => {
    events.on("routeChangeComplete", () => {});
  }, []);

  useRouteLoader();

  useServiceWorker();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, refetchOnMount: true },
        },
      })
  );
  if (route !== "/login") {
    return (
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider>
            <BrandProvider>
              <DefaultLayout {...pageProps}>
                <NotificationProvider>
                  <GlobalStyle />
                  <LoggedInAsBanner />
                  <Component {...pageProps} />
                </NotificationProvider>
              </DefaultLayout>
            </BrandProvider>
          </ThemeProvider>
        </Hydrate>
      </QueryClientProvider>
    );
  } else {
    return (
      <>
        <Head>
          <title>Flo CRM </title>
        </Head>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ThemeProvider>
              <BrandProvider>
                <GlobalStyle />
                <Component {...pageProps} />
              </BrandProvider>
            </ThemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </>
    );
  }
}

export default MyApp;
