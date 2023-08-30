import { CMSContent, CMSContentPath, CMSContents, CMSQueries } from "@/types";
import { fetchRequest } from "@/lib";

/**
 * Fetches CMS content using the provided parameters and handles response and error cases.
 *
 * @async
 * @param {string} baseURL - The base URL of the CMS API.
 * @param {string} apiPath - The API path for fetching content (e.g., '/api/cms/v2').
 * @param {CMSContent} content - The type of CMS content to fetch.
 * @param {CMSQueries} [queries] - Optional queries to filter the content.
 * @param {HeadersInit} [headers] - Additional headers to include in the request.
 * @param {RequestCache} [cache='force-cache'] - The caching strategy to use for the request.
 * @returns {Promise<{ meta: any; items: any[] } | any>} A Promise that resolves with the parsed JSON response data.
 * @throws {FetchError} When the request fails or an unexpected error occurs.
 *
 * @example
 * // Example usage:
 * const baseURL = 'https://api.example.com';
 * const apiPath = '/api/cms/v2';
 * const content = 'posts';
 * const queries = { category: 'news', limit: 10 };
 * const headers = { Authorization: 'Bearer token' };
 * const cache = 'no-store';
 *
 * try {
 *   const response = await fetchContent(baseURL, apiPath, content, queries, headers, cache);
 *   console.log('Response data:', response);
 * } catch (error) {
 *   if (error instanceof FetchError) {
 *     if (error.code === 'REQUEST_FAILED') {
 *       console.error('Request failed:', error.message);
 *       // Handle request failure
 *     } else if (error.code === 'UNEXPECTED_ERROR') {
 *       console.error('Unexpected error:', error.message);
 *       // Handle unexpected error
 *     }
 *   } else {
 *     console.error('An unknown error occurred:', error);
 *   }
 * }
 */
export const fetchContent = async (
  baseURL: string,
  apiPath: string, //  /api/cms/v2
  content: CMSContentPath,
  queries?: CMSQueries,
  headers?: HeadersInit,
  cache: RequestCache = "force-cache"
): Promise<CMSContents | CMSContent> => {
  // Note: No need of try/catch here, leave the user to handle
  // https://stackoverflow.com/questions/64227502/should-the-inner-function-or-the-calling-function-be-wrapped-within-a-try-catch

  // build the query string if queries are provided
  // random ordering with offset is not supported
  const query = queries
    ? Object.keys(queries)
        .map((key) => {
          const rest = queries as any;
          // if the value is an array, join the values with a comma
          if (Array.isArray(rest[key])) {
            return `${key}=${rest[key].join(",")}`;
          }
          return `${key}=${rest[key]}`;
        })
        .join("&")
    : "";

  const fullUrl = `${baseURL}${apiPath}/${content}/?${query}`;

  return await fetchRequest("GET", fullUrl, {}, headers, cache);
};
