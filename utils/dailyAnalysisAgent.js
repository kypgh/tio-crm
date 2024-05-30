import axios from "axios";
import {
  NEXT_PUBLIC_BACKEND_API_URL,
  NEXT_PUBLIC_DAILY_ANALYSIS_API_URL,
} from "../config/enums";
import { getInstance } from "./axiosProvider";
import { getCookie } from "cookies-next";
import { getJWTToken, setJWTToken } from "./agent";

/**
 * @return {import("axios").AxiosInstance}
 */
function createServerOrClientAxios(context) {
  if (context) {
    const token = getJWTToken();
    const refresh_token = getCookie("refresh_token", context);
    const brand = getCookie("crmBrand", context);
    return getInstance(
      token,
      refresh_token,
      brand,
      () => {},
      NEXT_PUBLIC_DAILY_ANALYSIS_API_URL
    );
  } else {
    const token = getJWTToken();
    const refresh_token = getCookie("refresh_token");
    const brand = getCookie("crmBrand", context);
    return getInstance(
      token,
      refresh_token,
      brand,
      setJWTToken,
      NEXT_PUBLIC_DAILY_ANALYSIS_API_URL
    );
  }
}

const dailyAnalysisAgent = (context) => {
  const { instance: sfAxios } = createServerOrClientAxios(context);
  return {
    getDailyAnalysis: async (page = 1, limit = 50, isTest = false) =>
      sfAxios
        .get(`/api/getEmailsStatuses`, {
          params: {
            page,
            limit,
            isTest,
          },
        })
        .then((res) => res.data),
  };
};

export default dailyAnalysisAgent;
