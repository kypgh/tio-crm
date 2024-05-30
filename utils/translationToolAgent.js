import axios from "axios";
import { NEXT_PUBLIC_TRANSLATION_TOOL_API_URL } from "../config/enums";
import agent, { getJWTToken } from "./agent";

const createAxios = (baseURL) => {
  const token = getJWTToken();

  let axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  axiosInstance.interceptors.response.use(undefined, async (error) => {
    if (error.response.data.code === 1) {
      return agent()
        .refreshAccessToken()
        .then((res) => {
          error.config.headers["Authorization"] = "Bearer " + res;
          error.config.baseURL = undefined;
          return axiosInstance.request(error.config);
        });
    }
    return Promise.reject(error);
  });

  return axiosInstance;
};
//

const translationToolAgent = () => {
  const translationAxios = createAxios(NEXT_PUBLIC_TRANSLATION_TOOL_API_URL);

  return {
    getAllApps: async () =>
      translationAxios.get("/api/webapps").then((res) => res.data),
    getAppById: async (appId) =>
      translationAxios.get(`/api/webapps/${appId}`).then((res) => res.data),
    getTranslationKeys: async (appId, language) =>
      translationAxios
        .get(`/api/webapps/${appId}/keys`, {
          params: {
            lang: language,
          },
        })
        .then((res) => res.data),
    createNewApp: async ({ name, languages }) =>
      translationAxios
        .post("/api/webapps", { name, languages })
        .then((res) => res.data),
    uploadJSON: async (appId, jsonFile) => {
      const formData = new FormData();
      formData.append("lang_en", jsonFile);
      return translationAxios.post(`/api/webapps/${appId}/keys/json`, formData);
    },
    uploadTranslationExcel: async (excelFile) => {
      const formData = new FormData();
      formData.append("translations", excelFile);
      return translationAxios.post(`/api/translations`, formData);
    },
    translateExcel: async (appId, excelFile) => {
      const formData = new FormData();

      formData.append("lang_en", excelFile);

      return translationAxios
        .post(`/api/translations/${appId}/fill`, formData, {
          responseType: "blob",
        })
        .then((response) => {
          // create file link in browser's memory
          const href = URL.createObjectURL(response.data);
          // create "a" HTML element with href to file & click
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", `fill.xlsx`); //or any other extension
          document.body.appendChild(link);
          link.click();
          // clean up "a" element & remove ObjectURL
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        });
    },
    downloadUntranslatedExcel: async (appId, fileName, jsonPath) => {
      return translationAxios
        .get(`/api/translations/${appId}/untranslated`, {
          params: {
            jsonPath,
          },
          responseType: "blob",
        })
        .then((response) => {
          // create file link in browser's memory
          const href = URL.createObjectURL(response.data);
          // create "a" HTML element with href to file & click
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", `${fileName}.xlsx`); //or any other extension
          document.body.appendChild(link);
          link.click();

          // clean up "a" element & remove ObjectURL
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        });
    },
    downloadJSON: async (appId, language) => {
      return translationAxios
        .get(`/api/webapps/${appId}/keys`, {
          params: {
            lang: language,
          },
        })
        .then((response) => {
          var dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(response.data, null, "\t"));

          // create "a" HTML element with href to file & click
          const link = document.createElement("a");
          link.href = dataStr;
          link.setAttribute("download", `lang_${language}.json`); //or any other extension
          document.body.appendChild(link);
          link.click();

          // clean up "a" element
          document.body.removeChild(link);
        });
    },

    downloadZip: async (appId) => {
      return translationAxios
        .get(`/api/webapps/${appId}/keys/zip`, {
          responseType: "blob",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `keys.zip`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    getAllLanguages: async () =>
      translationAxios.get("/api/languages").then((res) => res.data),
    updateWebapp: async (appId, name, languages) =>
      translationAxios
        .put(`/api/webapps/${appId}`, { name, languages })
        .then((res) => res.data),
    searchTranslations: async (word, toLang) =>
      translationAxios
        .post(`/api/translations/match`, { word, toLang })
        .then((res) => res.data),
    updateWordsForApp: async (appId, translations, lang = "en") => {
      await translationAxios
        .post(
          `/api/webapps/${appId}/keys`,
          {
            jsonPath: translations,
          },
          {
            params: {
              lang,
            },
          }
        )
        .then((res) => res.data);
    },
  };
};

export default translationToolAgent;
