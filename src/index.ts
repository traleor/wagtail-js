/**
 * Export all from "lib" and "types"
 */
export * from "@/lib";
export * from "@/types";
import { fetchContent } from "@/lib";
import {
  ClientOptions,
  CMSContent,
  CMSContentPath,
  CMSContents,
  CMSQueries,
  NotFoundContents,
} from "@/types";

/**
 * Class representing a client for fetching CMS content.
 */
export class CMSClient {
  private baseURL: string;
  private apiPath: string;
  private headers?: HeadersInit;
  private cache: RequestCache;

  /**
   * Creates an instance of CMSClient.
   * @param {ClientOptions} options - Options for configuring the client.
   */
  constructor(options: ClientOptions) {
    this.baseURL = options.baseURL;
    this.apiPath = options.apiPath;
    this.headers = options.headers;
    this.cache = options.cache || "force-cache";
  }

  /**
   * Fetches CMS content using the provided parameters and handles response and error cases.
   *
   * @async
   * @param {CMSContentPath} content - The type of CMS content to fetch.
   * @param {CMSQueries} [queries] - Optional queries to filter the content.
   * @param {HeadersInit} [headers] - Additional headers to include in the request.
   * @param {RequestCache} [cache] - The caching strategy to use for the request.
   * @returns {Promise<CMSContents | CMSContent>} A Promise that resolves with the parsed JSON response data.
   */
  public async fetchContent(
    content: CMSContentPath,
    queries?: CMSQueries,
    headers?: HeadersInit,
    cache?: RequestCache
  ): Promise<CMSContents | CMSContent> {
    return await fetchContent(
      this.baseURL,
      this.apiPath,
      content,
      queries,
      headers || this.headers,
      cache || this.cache
    );
  }

  /**
   * Fetches a single page based on its ID or slug, handling response and error cases.
   *
   * @async
   * @param {number | string} idOrSlug - The ID or slug of the page to fetch.
   * @param {CMSQueries} [queries] - Optional queries to filter the content.
   * @param {HeadersInit} [headers] - Additional headers to include in the request.
   * @param {RequestCache} [cache] - The caching strategy to use for the request.
   * @returns {Promise<CMSContent | NotFoundContents>} A Promise that resolves with the page content or a "not found" response.
   */
  public async fetchPage(
    idOrSlug: number | string,
    queries?: CMSQueries,
    headers?: HeadersInit,
    cache?: RequestCache
  ): Promise<CMSContent | NotFoundContents> {
    const contentType = "pages";

    if (typeof idOrSlug === "string") {
      const response = await this.fetchContent(
        contentType,
        { slug: idOrSlug, ...queries },
        headers,
        cache
      );

      if (response?.items && response.items.length > 0) {
        const page: CMSContent = response.items[0];
        return page;
      } else {
        return {
          message: "Page not found",
          data: response as CMSContents,
        };
      }
    } else {
      return (await this.fetchContent(
        `${contentType}/${idOrSlug}`,
        queries,
        headers,
        cache
      )) as CMSContent;
    }
  }

  /**
   * Fetches a single image based on its ID or slug, handling response and error cases.
   *
   * @async
   * @param {number | string} idOrSlug - The ID or slug of the image to fetch.
   * @param {CMSQueries} [queries] - Optional queries to filter the content.
   * @param {HeadersInit} [headers] - Additional headers to include in the request.
   * @param {RequestCache} [cache] - The caching strategy to use for the request.
   * @returns {Promise<CMSContent | NotFoundContents>} A Promise that resolves with the image content or a "not found" response.
   */
  public async fetchImage(
    idOrSlug: number | string,
    queries?: CMSQueries,
    headers?: HeadersInit,
    cache?: RequestCache
  ): Promise<CMSContent | NotFoundContents> {
    const contentType = "images";

    if (typeof idOrSlug === "string") {
      const response = await this.fetchContent(
        contentType,
        { slug: idOrSlug, ...queries },
        headers,
        cache
      );

      if (response?.items && response.items.length > 0) {
        const image: CMSContent = response.items[0];
        return image;
      } else {
        return {
          message: "Image not found",
          data: response as CMSContents,
        };
      }
    } else {
      return (await this.fetchContent(
        `${contentType}/${idOrSlug}`,
        queries,
        headers,
        cache
      )) as CMSContent;
    }
  }

  /**
   * Fetches a single document based on its ID or slug, handling response and error cases.
   *
   * @async
   * @param {number | string} idOrSlug - The ID or slug of the document to fetch.
   * @param {CMSQueries} [queries] - Optional queries to filter the content.
   * @param {HeadersInit} [headers] - Additional headers to include in the request.
   * @param {RequestCache} [cache] - The caching strategy to use for the request.
   * @returns {Promise<CMSContent | NotFoundContents>} A Promise that resolves with the document content or a "not found" response.
   */
  public async fetchDocument(
    idOrSlug: number | string,
    queries?: CMSQueries,
    headers?: HeadersInit,
    cache?: RequestCache
  ): Promise<CMSContent | NotFoundContents> {
    const contentType = "documents";

    if (typeof idOrSlug === "string") {
      const response = await this.fetchContent(
        contentType,
        { slug: idOrSlug, ...queries },
        headers,
        cache
      );

      if (response?.items && response.items.length > 0) {
        const document: CMSContent = response.items[0];
        return document;
      } else {
        return {
          message: "Document not found",
          data: response as CMSContents,
        };
      }
    } else {
      return (await this.fetchContent(
        `${contentType}/${idOrSlug}`,
        queries,
        headers,
        cache
      )) as CMSContent;
    }
  }

  /**
   * Fetches all pages based on the provided queries, handling response and error cases.
   *
   * @async
   * @param {CMSQueries} [queries] - Optional queries to filter the content.
   * @param {HeadersInit} [headers] - Additional headers to include in the request.
   * @param {RequestCache} [cache] - The caching strategy to use for the request.
   * @returns {Promise<CMSContents>} A Promise that resolves with the list of pages.
   */
  public async fetchPages(
    queries?: CMSQueries,
    headers?: HeadersInit,
    cache?: RequestCache
  ): Promise<CMSContents> {
    return (await this.fetchContent(
      "pages",
      queries,
      headers,
      cache
    )) as CMSContents;
  }

  /**
   * Fetches all images based on the provided queries, handling response and error cases.
   *
   * @async
   * @param {CMSQueries} [queries] - Optional queries to filter the content.
   * @param {HeadersInit} [headers] - Additional headers to include in the request.
   * @param {RequestCache} [cache] - The caching strategy to use for the request.
   * @returns {Promise<CMSContents>} A Promise that resolves with the list of images.
   */
  public async fetchImages(
    queries?: CMSQueries,
    headers?: HeadersInit,
    cache?: RequestCache
  ): Promise<CMSContents> {
    return (await this.fetchContent(
      "images",
      queries,
      headers,
      cache
    )) as CMSContents;
  }

  /**
   * Fetches all documents based on the provided queries, handling response and error cases.
   *
   * @async
   * @param {CMSQueries} [queries] - Optional queries to filter the content.
   * @param {HeadersInit} [headers] - Additional headers to include in the request.
   * @param {RequestCache} [cache] - The caching strategy to use for the request.
   * @returns {Promise<CMSContents>} A Promise that resolves with the list of documents.
   */
  public async fetchDocuments(
    queries?: CMSQueries,
    headers?: HeadersInit,
    cache?: RequestCache
  ): Promise<CMSContents> {
    return (await this.fetchContent(
      "documents",
      queries,
      headers,
      cache
    )) as CMSContents;
  }
}
