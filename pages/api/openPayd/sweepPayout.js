import { checkMainServerAuth } from "../../../backend/middleware/auth";
import Joi from "joi";
import axios from "axios";
import {
  OPENPAYD_API_URL,
  OPENPAYD_PASSWORD,
  OPENPAYD_USERNAME,
} from "../../../config/privateEnums";
import { filterObj } from "../../../utils/functions";
import _ from "lodash";

const sweepPayoutSchema = Joi.object({
  sweepSourceAccountId: Joi.string().required(),
  linkedAccountHolderId: Joi.string().required(),
  accountId: Joi.string().required(),
  beneficiary: Joi.object({
    bankAccountCountry: Joi.string().required(),
    bankName: Joi.string().allow(""),
    customerType: Joi.string().allow(""),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    beneficiaryAddressLine: Joi.string().allow(""),
    beneficiaryCity: Joi.string().allow(""),
    beneficiaryCountry: Joi.string().allow(""),
    beneficiaryPostalCode: Joi.string().allow(""),
    iban: Joi.string().allow(""),
    bic: Joi.string().allow(""),
    accountNumber: Joi.string().allow(""),
    routingCodes: Joi.object({
      SORT_CODE: Joi.string().allow(""),
    }),
  }),
  amount: Joi.object({
    currency: Joi.string().required(),
    value: Joi.number().required(),
  }),
  paymentType: Joi.string().required(),
  reference: Joi.string().required(),
  reasonCode: Joi.string().allow(""),
});

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

  if (req.method === "POST") {
    const { value, error } = sweepPayoutSchema.validate(req.body);

    if (error) {
      res.status(400).json(error);
      return;
    }

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

      const data = filterObj(value, (v) => !(_.isNil(v) || v === ""));

      const { data: result } = await axios({
        method: "post",
        url: `${OPENPAYD_API_URL}/transactions/sweepPayout`,
        headers: {
          Authorization: `Bearer ${access_token}`,
          "x-account-holder-id": "8eb9de9b-bca3-4d3d-9586-b87e9e304813",
        },
        data,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("dis", error);
      res
        .status(500)
        .json(error?.response?.data || { message: "Something went wrong" });
    }
  }
}
