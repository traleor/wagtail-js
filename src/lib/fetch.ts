export class FetchError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "FetchError";
  }
}

/**
 * Performs an HTTP request using the Fetch API and handles response and error cases.
 *
 * @param {string} method - The HTTP method for the request (e.g., 'GET', 'POST', 'PUT').
 * @param {RequestInfo | URL} url - The URL or Request object to send the request to.
 * @param {any} data - The data to include in the request body (used for non-GET requests).
 * @param {HeadersInit} [headers] - Additional headers to include in the request.
 * @param {RequestCache} [cache='force-cache'] - The caching strategy to use for the request.
 * @returns {Promise<any>} A Promise that resolves with the parsed JSON response data.
 * @throws {FetchError} When the request fails or an unexpected error occurs.
 *
 * @example
 * // Example usage:
 * const method = 'GET';
 * const url = 'https://api.example.com/cms';
 * const data = { key: 'value' };
 * const headers = { Authorization: 'Bearer token' };
 * const cache = 'no-cache';
 *
 * try {
 *   const response = await fetchRequest(method, url, data, headers, cache);
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
export const fetchRequest = async (
  method: string,
  url: RequestInfo | URL,
  data: any,
  headers?: HeadersInit,
  cache: RequestCache = "force-cache"
): Promise<any> => {
  try {
    const response = await fetch(url, {
      cache,
      method,
      headers,
      ...(method !== "GET" && { body: JSON.stringify(data) }),
    });

    if (!response.ok) {
      throw new FetchError("Request failed", "REQUEST_FAILED");
    }

    return await response.json();
  } catch (error) {
    console.group("FETCH_REQUEST_ERROR");
    console.log("method: ", method);
    console.log("url: ", url)
    console.log("data: ", data);
    console.log("headers: ", headers);
    console.log("error: ", error);
    console.groupEnd();
    if (error instanceof FetchError) {
      throw error; // Re-throw the custom FetchError
    }

    throw new FetchError("An unexpected error occurred", "UNEXPECTED_ERROR");
  }
};
