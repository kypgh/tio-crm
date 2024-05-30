import { getCookie, setCookie } from "cookies-next";
import { createContext, useContext, useEffect, useState } from "react";
import useUser from "./useUser";
import { useQueryClient } from "@tanstack/react-query";
import agent from "../agent";
import { useRouter } from "next/router";

const BrandContext = createContext();

export default function useSelectedBrand() {
  const [selectedBrand, setSelectedBrand, isLoading] = useContext(BrandContext);

  return [selectedBrand, setSelectedBrand, isLoading];
}

export const BrandProvider = ({ children }) => {
  const [selectedBrand, setSelectedBrand] = useState("TIO");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data, refetch } = useUser({
    enabled: router.pathname !== "/login",
  });
  function setBrand(brand) {
    if (brand === selectedBrand) return;
    setIsLoading(true);
    setCookie("crmBrand", brand);
    refetch()
      .then((res) => {
        setSelectedBrand(res.data.user.selectedBrand);
        setIsLoading(false);
        router.push("/");
      })
      .finally(() => setIsLoading(false));
  }

  // Get brand from cookie on load
  useEffect(() => {
    const brand = getCookie("crmBrand");
    if (brand && ["TIO", "PIX"].includes(brand)) {
      setSelectedBrand(brand);
    } else {
      setCookie("crmBrand", selectedBrand);
    }
  }, []);

  // Check user every time it loads if he has access to brand otherwise set brand to first brand in his list
  useEffect(() => {
    const brand = getCookie("crmBrand");
    if (data?.user) {
      if (!data.user?.brands?.includes(brand)) {
        setBrand(data.user?.brands[0]);
      }
    }
  }, [data]);

  return (
    <BrandContext.Provider value={[selectedBrand, setBrand, isLoading]}>
      {children}
    </BrandContext.Provider>
  );
};
