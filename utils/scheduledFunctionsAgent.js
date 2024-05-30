import { getCookie } from "cookies-next";
import { NEXT_PUBLIC_SCHEDULED_FUNCTIONS_API_URL } from "../config/enums";
import { getInstance } from "./axiosProvider";
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
      NEXT_PUBLIC_SCHEDULED_FUNCTIONS_API_URL
    );
  } else {
    const token = getJWTToken();
    const refresh_token = getCookie("refresh_token");
    const brand = getCookie("crmBrand");
    return getInstance(
      token,
      refresh_token,
      brand,
      setJWTToken,
      NEXT_PUBLIC_SCHEDULED_FUNCTIONS_API_URL
    );
  }
}

const scheduledFunctionsAgent = (context) => {
  const { instance: sfAxios, refreshAccessToken } =
    createServerOrClientAxios(context);
  return {
    getCronTasks: async () =>
      sfAxios.get("/api/cronTasks").then((res) => res.data.cronTasks),
    getCronTaskResults: async (cronTaskId, page = 0, limit = 10) => {
      return sfAxios
        .get(`/api/cronTasks/${cronTaskId}/cronTaskResults`, {
          params: {
            page,
            limit,
          },
        })
        .then((res) => res.data);
    },
    updateCronTask: async (cronTaskId, { name, cronPattern, enabled }) =>
      sfAxios.put(`/api/cronTasks/${cronTaskId}`, {
        name,
        cronPattern,
        enabled,
      }),
    forceRunTask: async (cronTaskId) =>
      sfAxios.post(`/api/cronTasks/${cronTaskId}/forcerun`),
    getServerHealth: async () => sfAxios.get("/api/awsHealthStatus"),
  };
};

export default scheduledFunctionsAgent;
