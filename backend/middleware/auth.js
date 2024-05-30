import axios from "axios";
import { NEXT_PUBLIC_BACKEND_API_URL } from "../../config/enums";
import { BACKEND_AUTH_API_KEY } from "../../config/privateEnums";

export async function checkMainServerAuth(authHeader) {
  return axios
    .get(`${NEXT_PUBLIC_BACKEND_API_URL}/dashboard/auth/isAuth`, {
      headers: {
        "x-api-key": BACKEND_AUTH_API_KEY,
        Authorization: authHeader,
      },
    })
    .then((res) => ({ user: res.data }))
    .catch((err) => ({
      error: "Invalid token",
    }));
}
