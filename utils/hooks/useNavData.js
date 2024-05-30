import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { navData } from "../../config/navigationbarData";
import useUser from "./useUser";
import { useLocalStorage } from "usehooks-ts";
import useSelectedBrand from "./useSelectedBrand";
import agent from "../agent";

function parseNavData(nd, params = {}) {
  return nd.map((n) => ({
    ...n,
    url: typeof n.url === "function" ? n.url(params) : n.url || "",
    ...(n.children ? { children: parseNavData(n.children, params) } : {}),
  }));
}

function filterNavData(user, url, query) {
  let allowed = true;
  const userPerms = [
    ...new Set([
      ...(user?.permissions || []),
      ...(user?.role?.permissions || []),
    ]),
  ];
  const filteredNavData = navData.map((nav) => {
    const navItem = { ...nav };
    navItem.url =
      typeof navItem.url === "function"
        ? navItem.url(query)
        : navItem.url || "";
    if (navItem.children) {
      navItem.disabled = true;
      navItem.children = navItem.children.map((c) => {
        const child = { ...c };
        child.url =
          typeof child.url === "function" ? child.url(query) : child.url || "";
        if (user?.role?.name !== "admin" || child.bypassAdmin) {
          child.disabled =
            !!child.permissions.length &&
            !child.permissions.some((perm) => userPerms.includes(perm));
        } else {
          child.disabled = false;
        }
        if (navItem.url + child.url === url) allowed = !child.disabled;
        if (!child.disabled && child.display) navItem.disabled = false;
        return child;
      });
    } else {
      if (user?.role?.name !== "admin" || navItem.bypassAdmin) {
        navItem.disabled =
          !!navItem.permissions.length &&
          !navItem.permissions.some((perm) => userPerms.includes(perm));
      } else {
        navItem.disabled = false;
      }
    }
    if (navItem.url === url) allowed = !navItem.disabled;
    return navItem;
  });
  return { filteredNavData, allowed };
}

export default function useNavData() {
  const router = useRouter();
  const { data, isLoading, isFetching } = useUser();
  const [isNavLoading, setIsNavLoading] = useState(true);
  const [selectedBrand] = useSelectedBrand();
  const [filteredNavData, setFilteredNavData] = useLocalStorage(
    `${selectedBrand}-filteredNavData`,
    []
  );
  useEffect(() => {
    if (isLoading || isFetching) return;
    setIsNavLoading(true);
    try {
      if (!data?.user) {
        agent().logOutCrmUser();
        router.push({
          pathname: "/login",
          query: {
            redirect: router.asPath,
          },
        });
      } else {
        const { allowed, filteredNavData } = filterNavData(
          data.user,
          router.pathname,
          router.query
        );
        if (!allowed) {
          setIsNavLoading(false);
          router.push({
            pathname: "/",
            query: {
              error: 401,
            },
          });
        } else {
          setIsNavLoading(false);
          setFilteredNavData(filteredNavData);
          return;
          // return filteredNavData;
        }
      }
    } catch (err) {
      console.error(err);
      setIsNavLoading(false);
      router.push({
        pathname: "/",
        query: {
          error: 500,
        },
      });
    }
    setFilteredNavData(parseNavData(navData));
  }, [data, isLoading, isFetching]);
  return { navData: filteredNavData, isLoading: isNavLoading };
}
