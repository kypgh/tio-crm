import { checkMainServerAuth } from "../../../backend/middleware/auth";
import axios from "axios";
import {
  OPENPAYD_API_URL,
  OPENPAYD_PASSWORD,
  OPENPAYD_USERNAME,
} from "../../../config/privateEnums";

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  const { error, user } = await checkMainServerAuth(req.headers.authorization);

  if (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (req.method === "GET") {
    try {
      let accessTokenResponse = await axios({
        method: "post",
        url: `${OPENPAYD_API_URL}/oauth/token`,
        auth: {
          username: OPENPAYD_USERNAME,
          password: OPENPAYD_PASSWORD,
        },
        params: {
          grant_type: "client_credentials",
        },
      });

      let access_token = accessTokenResponse.data.access_token;

      const { data } = await axios({
        method: "get",
        url: `${OPENPAYD_API_URL}/accounts?primary=true&sort=createdDate,desc`,
        headers: {
          Authorization: `Bearer ${access_token}`,
          "x-account-holder-id": "8eb9de9b-bca3-4d3d-9586-b87e9e304813", // temp
        },
      });

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
