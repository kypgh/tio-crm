import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import agent from "../agent";
import { PERMISSIONS } from "../../config/permissions";

function getPermissionValues() {
  return Object.values(PERMISSIONS).flatMap((permGroup) =>
    Object.values(permGroup).map(({ value }) => value)
  );
}

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
const useUser = (options = {}) => {
  return {
    data: {
      user: {
        email: "userEmail@gmail.com",
        password: "userPassword",
        first_name: "userFirstName",
        last_name: "userLastName",
        brands: ["Brand1", "Brand2"],
        role: {
          name: "admin",
        },
        permissions: getPermissionValues(),
      },
    },
    ...options,
  };
};

export default useUser;
