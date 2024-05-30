import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import agent from "../agent";

/**
 * @param {UseQueryOptions} options - The options for the query.
 * @returns {UseQueryResult} The result of the query.
 */
const useUser = (options = {}) => {
  return useQuery(
    ["currentUser"],
    async () => {
      await agent().refreshAccessToken();
      return agent()
        .getCurrentCrmUser()
        .then((res) => res.data)
        .catch((err) => ({}));
    },
    {
      refetchOnMount: true,
      staleTime: 1000 * 60 * 1,
      retry: (failureCount, error) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403 ||
          error?.response?.status === 400
        ) {
          return false;
        }
        return failureCount < 3;
      },
      ...options,
    }
  );
};

export default useUser;
