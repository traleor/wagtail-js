import { CMSClient } from "./index";
import { CMSContentPath, CMSMediaMeta, CMSQueries } from "@/types";
import { FetchError } from "@/lib";
import { fetchContent } from "@/lib";

// Mock the fetchContent module
jest.mock("./lib/cms");

describe("CMSClient", () => {
  const baseURL = "https://demo.traleor.com";
  const mediaBaseURL = "https://cdn.traleor.com";
  const apiPath = "/api/cms/v2";
  const headers = { Authorization: "Bearer token" };
  const cache = "no-store";
  const content: CMSContentPath = "pages";
  const queries: CMSQueries = {
    category: "news",
    limit: 10,
  };

  const client = new CMSClient({
    baseURL,
    mediaBaseURL,
    apiPath,
    headers,
    cache,
  });

  const mockFetchContent = require("./lib/cms").fetchContent;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should construct a CMSClient instance with valid options", () => {
    const client = new CMSClient({
      baseURL,
      mediaBaseURL,
      apiPath,
      headers,
      cache,
    });

    expect(client).toBeInstanceOf(CMSClient);
    expect(client["baseURL"]).toBe(baseURL);
    expect(client["mediaBaseURL"]).toBe(mediaBaseURL);
    expect(client["apiPath"]).toBe(apiPath);
    expect(client["headers"]).toEqual(headers);
    expect(client["cache"]).toBe(cache);
  });

  it("should throw an error when baseURL, mediaBaseURL or apiPath ends with '/'", () => {
    expect(() => {
      new CMSClient({
        baseURL: "https://example.com/",
        mediaBaseURL: "https://cdn.example.com/",
        apiPath: "/api/v2/",
        headers,
        cache,
      });
    }).toThrowError('baseURL, mediaBaseURL or apiPath must not end with "/"');
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

  it("should fetch a single page based on ID or slug", async () => {
    // Mock the fetchContent function to return a successful response
    const resp = {
      meta: { total_count: 1 },
      items: [{ id: "1" }],
    };
    mockFetchContent.mockResolvedValue(resp);

    const idOrSlug = "example-slug";
    const response = await client.fetchPage(idOrSlug, queries);

    expect(response).toEqual(resp.items[0]);

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      "pages",
      { slug: idOrSlug, ...queries },
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should return Page not found", async () => {
    // Mock the fetchContent function to return an empty response
    mockFetchContent.mockResolvedValue({ items: [] });

    const idOrSlug = "non-existent-page";
    const response: any = await client.fetchPage(idOrSlug, queries);

    expect(response.message).toBe("Page not found");
    expect(response.data).toEqual({ items: [] });
  });

  it("should handle FetchError and return 'Page not found' with error data", async () => {
    // Mock the fetchContent function to throw a FetchError
    const fetchError = new FetchError("Request failed", "REQUEST_FAILED");
    mockFetchContent.mockRejectedValue(fetchError);

    const idOrSlug = 120;

    try {
      const response: any = await client.fetchPage(idOrSlug, queries);
      expect(response.message).toBe("Page not found");
      expect(response.data).toBe(fetchError);
    } catch (error) {
      // Ensure that this branch is not entered
      fail("Error should not be thrown");
    }
  });

  it("should fetch a single image based on ID or slug", async () => {
    // Mock the fetchContent function to return a successful response
    const resp = {
      meta: { total_count: 1 },
      items: [{ id: "1" }],
    };
    mockFetchContent.mockResolvedValue(resp);

    const id = 1;
    const response = await client.fetchImage(id, queries);

    expect(response).toEqual(resp);

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      `images/${id}`,
      { ...queries },
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should fetch a single document based on ID or slug", async () => {
    // Mock the fetchContent function to return a successful response
    const resp = {
      meta: { total_count: 1 },
      items: [{ id: "1" }],
    };
    mockFetchContent.mockResolvedValue(resp);

    const id = 1;
    const response = await client.fetchDocument(id, queries);

    expect(response).toEqual(resp);

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      `documents/${id}`,
      { ...queries },
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should handle unsuccessful request for fetchPage", async () => {
    // Mock the fetchRequest function to return an error response
    mockFetchContent.mockRejectedValue(
      new FetchError("Page not found", "REQUEST_FAILED")
    );

    const idOrSlug = "non-existent-page";

    try {
      await client.fetchPage(idOrSlug, queries);
    } catch (error: any) {
      expect(error).toBeInstanceOf(FetchError);
      expect(error.code).toBe("REQUEST_FAILED");
      expect(error.message).toBe("Page not found");
    }

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      "pages",
      { slug: idOrSlug, ...queries },
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should handle unsuccessful request for fetchImage", async () => {
    // Mock the fetchRequest function to return an error response
    mockFetchContent.mockRejectedValue(
      new FetchError("Image not found", "REQUEST_FAILED")
    );

    try {
      await client.fetchImage(1, queries);
    } catch (error: any) {
      expect(error).toBeInstanceOf(FetchError);
      expect(error.code).toBe("REQUEST_FAILED");
      expect(error.message).toBe("Image not found");
    }

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      `images/${1}`,
      { ...queries },
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should handle unsuccessful request for fetchDocument", async () => {
    // Mock the fetchRequest function to return an error response
    mockFetchContent.mockRejectedValue(
      new FetchError("Document not found", "REQUEST_FAILED")
    );

    try {
      await client.fetchDocument(1, queries);
    } catch (error: any) {
      expect(error).toBeInstanceOf(FetchError);
      expect(error.code).toBe("REQUEST_FAILED");
      expect(error.message).toBe("Document not found");
    }

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      `documents/${1}`,
      { ...queries },
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should handle unknown error occurred fetchPage, fetchImage and fetchDocument", async () => {
    // Mock the fetchRequest function to return an error response
    mockFetchContent.mockRejectedValue({
      message: "An unknown error occurred:",
    });

    try {
      await client.fetchPage(1, queries);
      await client.fetchImage(1, queries);
      await client.fetchDocument(1, queries);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("An unknown error occurred:");
    }

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      `pages/${1}`,
      { ...queries },
      { Authorization: "Bearer token" },
      cache
    );
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      `images/${1}`,
      { ...queries },
      { Authorization: "Bearer token" },
      cache
    );
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      `documents/${1}`,
      { ...queries },
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should fetch all pages", async () => {
    // Mock the fetchContent function to return a successful response
    const resp = {
      meta: { total_count: 1 },
      items: [{ id: "1" }],
    };
    mockFetchContent.mockResolvedValue(resp);

    const response = await client.fetchPages(queries);

    expect(response).toEqual(resp);

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      "pages",
      queries,
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should fetch all images", async () => {
    // Mock the fetchContent function to return a successful response
    const resp = {
      meta: { total_count: 1 },
      items: [{ id: "1" }],
    };
    mockFetchContent.mockResolvedValue(resp);

    const response = await client.fetchImages(queries);

    expect(response).toEqual(resp);

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      "images",
      queries,
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should fetch all documents", async () => {
    // Mock the fetchContent function to return a successful response
    const resp = {
      meta: { total_count: 1 },
      items: [{ id: "1" }],
    };
    mockFetchContent.mockResolvedValue(resp);

    const response = await client.fetchDocuments(queries);

    expect(response).toEqual(resp);

    // Ensure that fetchContent was called with the correct arguments
    expect(fetchContent).toHaveBeenCalledWith(
      baseURL,
      apiPath,
      "documents",
      queries,
      { Authorization: "Bearer token" },
      cache
    );
  });

  it("should construct the URL for a media item based on its type", () => {
    const imageMedia: CMSMediaMeta = {
      type: "wagtailimages.Image",
      detail_url: "https://demo.traleor.com/api/cms/v2/images/2/",
      download_url: "/images/1/image.jpg",
    };
    const documentMedia = {
      type: "wagtaildocs.Document",
      detail_url: "https://demo.traleor.com/api/cms/v2/documents/2/",
      download_url: "https://demo.traleor.com/docs/2/document.pdf",
    };

    const imageSrc = client.getMediaSrc(imageMedia);
    const documentSrc = client.getMediaSrc(documentMedia);

    expect(imageSrc).toBe("https://cdn.traleor.com/images/1/image.jpg");
    expect(documentSrc).toBe("https://cdn.traleor.com/docs/2/document.pdf");
  });
});
