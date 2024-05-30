import axios from "axios";
import {
  OPENPAYD_USERNAME,
  OPENPAYD_PASSWORD,
  OPENPAYD_API_URL,
} from "../../../config/privateEnums";
import Joi from "joi";
import { countryDataCodes } from "../../../config/countries";
import { pruneNullOrUndefinedFields } from "../../../utils/functions";
import { checkMainServerAuth } from "../../../backend/middleware/auth";

const updateClientPersonalDetailsSchema = Joi.object({
  account_holder_id: Joi.string().required(),
  address_line_1: Joi.string().optional().allow(""),
  address_line_2: Joi.string().optional().allow(""),
  city: Joi.string().optional().allow(""),
  state: Joi.string().optional().allow(""),
  post_code: Joi.string().optional().allow(""),
  country: Joi.string()
    .optional()
    .valid(...countryDataCodes.map((c) => c.iso2.toUpperCase())),
  friendly_name: Joi.string().optional().allow(""),
  first_name: Joi.string().optional().allow(""),
  last_name: Joi.string().optional().allow(""),
  metaData: Joi.object().optional().allow({}),
  dob: Joi.string().isoDate().optional().allow(""),
  email: Joi.string().email().optional().allow(""),
  phone: Joi.string().optional().allow(""),
  company_name: Joi.string().optional().allow(""),
  contact_name: Joi.string().optional().allow(""),
  identificationValue: Joi.string().optional().allow(""),
  identificationType: Joi.string()
    .optional()
    .valid("PASSPORT", "DRIVERS_LICENSE", "NATIONAL_ID", "OTHER"),
  company_type: Joi.string()
    .optional()
    .valid(
      "LIMITED_LIABILITY",
      "SOLE_TRADER",
      "PARTNERSHIP",
      "PUBLIC_LIMITED_COMPANY",
      "JOINT_STOCK_COMPANY",
      "CHARITY"
    ),
  registration_number: Joi.string().optional().allow(""),
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
  if (user.role?.name !== "admin") {
    res.status(401).json({ message: "Unauthorized - only admins allowed!" });
    return;
  }
  if (req.method === "POST") {
    const { value, error } = updateClientPersonalDetailsSchema.validate(
      req.body
    );

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
      const data = pruneNullOrUndefinedFields({
        friendlyName: value.friendly_name,
        firstName: value.first_name,
        lastName: value.last_name,
        email: value.email,
        phone: value.phone,
        dateOfBirth: value.dob,
        identificationType: value.identificationType,
        identificationValue: value.identificationValue,
        companyName: value.company_name,
        companyType: value.company_type,
        contactName: value.contact_name,
        registrationNumber: value.registration_number,
        individualAddress: {
          address: {
            addressLine1: value.address_line_1,
            addressLine2: value.address_line_2,
            city: value.city,
            state: value.state,
            postCode: value.post_code,
            country: value.country,
          },
        },
      });
      if (value.metaData) {
        data.metadata = value.metaData;
      }
      await axios({
        method: "put",
        url: `${OPENPAYD_API_URL}/linkedClient/${value.account_holder_id}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
          "x-account-holder-id": value.account_holder_id,
        },
        data,
      });
      res.status(200).json({ message: "Updated deails " });
    } catch (err) {
      console.error("error", err);
      res.status(500).json({ message: "Failed to update details" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
