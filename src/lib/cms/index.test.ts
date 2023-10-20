import { buildQueryString } from "@/utils";
import { FetchError, fetchRequest } from "../fetch";
import { fetchContent } from "./index"; // Replace with the actual path to your module
import { CMSContentPath, CMSQueries } from "@/types";

// Mock the fetchRequest module
jest.mock("../fetch");

describe("fetchContent", () => {
  const baseURL = "https://api.example.com";
  const apiPath = "/api/cms/v2";
  const content = "pages";
  const queries = { category: "news", limit: 10 };
  const headers = { Authorization: "Bearer token" };
  const cache = "no-store";
  const response = {
    ok: true,
    json: () => ({ data: "Mock Response" }),
  };
  const query = buildQueryString(queries);

  const fullUrl = `${baseURL}${apiPath}/${content}/?${query}`;

  const mockFetchRequest = require("../fetch").fetchRequest;

  //   beforeEach(() => {

  //   });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should make a successful GET request to fetch content", async () => {
    // Mock the fetchRequest function to return a successful response
    mockFetchRequest.mockResolvedValue(response);
    const resp = await fetchContent(
      baseURL,
      apiPath,
      content,
      queries,
      headers,
      cache
    );

    expect(resp).toEqual(response);
    // Ensure that fetchRequest was called with the correct arguments
    expect(fetchRequest).toHaveBeenCalledWith(
      "GET",
      fullUrl,
      {},
      headers,
      cache
    );
  });

  it("should handle an unsuccessful GET request", async () => {
    // Mock the fetchRequest function to return an error response
    mockFetchRequest.mockRejectedValue(
      new FetchError("Request failed", "REQUEST_FAILED")
    );

    try {
      await fetchContent(baseURL, apiPath, content, queries, headers, cache);
    } catch (error: any) {
      expect(error).toBeInstanceOf(FetchError);
    }
    // Ensure that fetchRequest was called with the correct arguments
    expect(fetchRequest).toHaveBeenCalledWith(
      "GET",
      fullUrl,
      {},
      headers,
      cache
    );
  });

  it("should handle unexpected errors", async () => {
    // Mock the fetchRequest function to throw an unexpected error
    mockFetchRequest.mockRejectedValue(new Error("Unexpected error"));

    try {
      await fetchContent(baseURL, apiPath, content, queries, headers, cache);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Unexpected error");
    }

    // Ensure that fetchRequest was called with the correct arguments
    expect(fetchRequest).toHaveBeenCalledWith(
      "GET",
      fullUrl,
      {},
      headers,
      cache
    );
  });

  it("should handle unsupported query parameters", async () => {
    const queries: CMSQueries = {
      category: "news",
      limit: 10,
      order: "random",
      offset: 5,
    };

    try {
      await fetchContent(baseURL, apiPath, content, queries, headers, cache);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        "Random ordering with offset is not supported. Please remove either the 'order' or 'offset' query."
      );
    }

    // Ensure that fetchRequest was not called due to the unsupported query parameters
    expect(fetchRequest).not.toHaveBeenCalled();
  });

  it("should handle unsupported query parameters for non-pages content", async () => {
    const content = "articles" as CMSContentPath;

    const queries: CMSQueries = {
      category: "news",
      limit: 10,
      child_of: 1,
    };

    try {
      await fetchContent(baseURL, apiPath, content, queries, headers, cache);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        "Filtering by tree position is supported only for pages. Please remove the 'child_of', 'ancestor_of' or 'decendant_of'  query."
      );
    }

    // Ensure that fetchRequest was not called due to the unsupported query parameters
    expect(fetchRequest).not.toHaveBeenCalled();
  });
});
