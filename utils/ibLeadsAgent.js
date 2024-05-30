import { NEXT_PUBLIC_IB_LEADS_API_URL } from "../config/enums";
import agent, { getJWTToken } from "./agent";
import axios from "axios";

const ibAxios = axios.create({
  baseURL: NEXT_PUBLIC_IB_LEADS_API_URL,
  headers: {
    "x-api-key": "",
  },
});

const ibUserAgent = {
  getUserByEmail: async (email) =>
    ibAxios
      .get("/api/leads/", { params: { email: email } })
      .then((res) => res.data),
  getUploadProgressStatus: async () =>
    ibAxios.get("/api/leads/uploadProcess").then((res) => res.data),
  uploadIbLeadsExcel: async (excelFile) => {
    const formData = new FormData();
    formData.append("leads", excelFile);
    return ibAxios.put(`/api/leads/uploadProcess`, formData, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  },
  forceStopUpload: async () =>
    ibAxios.delete("/api/leads/uploadProcess").then((res) => res.data),
};

export default ibUserAgent;
