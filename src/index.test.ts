import { CMSClient } from "./index"; // Adjust the path as needed
import { CMSContentPath, CMSQueries } from "@/types";
import { FetchError } from "@/lib";
import { buildQueryString } from "@/utils";
import { fetchContent } from "@/lib";

// Mock the fetchContent module
jest.mock("./lib/cms");

describe("CMSClient", () => {
  const baseURL = "https://api.example.com";
  const apiPath = "/api/cms/v2";
  const headers = { Authorization: "Bearer token" };
  const cache = "no-store";
  const content: CMSContentPath = "pages";
  const queries: CMSQueries = {
    category: "news",
    limit: 10,
  };

  const client = new CMSClient({ baseURL, apiPath, headers, cache });

  const mockFetchContent = require("./lib/cms").fetchContent;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should construct a CMSClient instance with valid options", () => {
    const client = new CMSClient({
      baseURL,
      apiPath,
      headers,
      cache,
    });

    expect(client).toBeInstanceOf(CMSClient);
    expect(client["baseURL"]).toBe(baseURL);
    expect(client["apiPath"]).toBe(apiPath);
    expect(client["headers"]).toEqual(headers);
    expect(client["cache"]).toBe(cache);
  });

  it("should throw an error when baseURL or apiPath ends with '/'", () => {
    expect(() => {
      new CMSClient({
        baseURL: "https://example.com/",
        apiPath: "/api/v2/",
        headers,
        cache,
      });
    }).toThrowError('baseURL and apiPath must not end with "/"');
  });

  it("should fetch CMS content", async () => {
    // Mock the fetchContent function to return a successful response
    mockFetchContent.mockResolvedValue({ data: "Mock Response" });

    const response = await client.fetchContent(content, queries);
    expect(response).toEqual({ data: "Mock Response" });
    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      content,
      queries,
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should handle unsuccessful request for fetchContent", async () => {
    const content: CMSContentPath = "pages";
    const queries: CMSQueries = {
      category: "news",
      limit: 10,
    };

    // Mock the fetchRequest function to return an error response
    mockFetchContent.mockRejectedValue(
      new FetchError("Request failed", "REQUEST_FAILED")
    );

    try {
      await client.fetchContent(content, queries);
    } catch (error: any) {
      expect(error).toBeInstanceOf(FetchError);
      expect(error.code).toBe("REQUEST_FAILED");
      expect(error.message).toBe("Request failed");
    }
    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      content,
      queries,
      { Authorization: "Bearer token" },
      cache
    );
  });
});
