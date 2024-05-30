import axios from "axios";
import { NEXT_PUBLIC_BACKEND_API_URL } from "../config/enums";

export const refreshAccessToken = async (
  refresh_token,
  url = `${NEXT_PUBLIC_BACKEND_API_URL}/dashboard/auth/token`,
  brand
) => {
  const res = await axios.post(url, {
    refresh_token,
    brand,
  });
  return res.data.token;
};

export const getInstance = (
  token,
  refreshToken,
  brand,
  setToken = () => {},
  baseURL = NEXT_PUBLIC_BACKEND_API_URL,
  refreshAccessTokenURL = `${NEXT_PUBLIC_BACKEND_API_URL}/dashboard/auth/token`
) => {
  let instance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  instance.interceptors.response.use(undefined, async (error) => {
    if (
      error.response.data.code === 17 ||
      (error.response.data.code === 14 && error.config.retry < 1)
    ) {
      return refreshAccessToken(
        refreshToken,
        refreshAccessTokenURL,
        brand
      ).then((res) => {
        setToken(res);
        error.config.headers["Authorization"] = "Bearer " + res;
        error.config.baseURL = undefined;
        error.config.retry = (error.config.retry || 0) + 1;
        return instance.request(error.config);
      });
    }
    return Promise.reject(error);
  });
  return {
    instance,
    refreshAccessToken: () =>
      refreshAccessToken(refreshToken, refreshAccessTokenURL, brand).then(
        (res) => {
          setToken(res);
          return res;
        }
      ),
  };
};
