import { useQuery } from "@tanstack/react-query";
import translationToolAgent from "../translationToolAgent";

/**
 *
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useTranslationApps = (options) => {
  return useQuery({
    queryKey: ["translationApps"],
    queryFn: () => translationToolAgent().getAllApps(),
    ...options,
  });
};

/**
 *
 * @param {string} appId
 * @param {string} language
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useTranslationKeys = (appId, language = "en", options) => {
  return useQuery({
    queryKey: ["translationKeys", appId, language],
    queryFn: () => translationToolAgent().getTranslationKeys(appId, language),
    enabled: !!appId,
    ...options,
  });
};

/**
 *
 * @param {string} appId
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useTranslationAppById = (appId, options) => {
  return useQuery({
    queryKey: ["translationApps", appId],
    queryFn: () => translationToolAgent().getAppById(appId),
    enabled: !!appId,
    ...options,
  });
};
