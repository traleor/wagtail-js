/**
 * Export all from "lib" and "types"
 */
export * from "@/lib";
export * from "@/types";
import { FetchError, fetchContent } from "@/lib";
import {
  ClientOptions,
  CMSContent,
  CMSContentPath,
  CMSContents,
  CMSMediaMeta,
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
   * Checks if a string ends with a '/'.
   * @param {string} str - The string to check.
   * @returns {boolean} True if the string ends with '/', false otherwise.
   */
  private endsWithSlash(str: string): boolean {
    return str.endsWith("/");
  }

  /**
   * Creates an instance of CMSClient.
   * @param {ClientOptions} options - Options for configuring the client.
   * @param {string} options.baseURL - The base URL of the CMS.
   * @param {string} options.apiPath - The path to the CMS API.
   * @param {HeadersInit} [options.headers] - Additional headers to include in the request.
   * @param {RequestCache} [options.cache] - The caching strategy to use for the request.
   * @memberof CMSClient
   * @example
   * const client = new CMSClient({
   *  baseURL: "https://example.com",
   * apiPath: "/api/v2",
   * headers: {},
   * cache: "force-cache",
   * });
   *
   */
  constructor(options: ClientOptions) {
    if (
      this.endsWithSlash(options.baseURL) ||
      this.endsWithSlash(options.apiPath)
    ) {
      throw new Error('baseURL and apiPath must not end with "/"');
    }
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
   * @param {number | string} idOrSlug - The ID (number) or slug (string) of the page to fetch.
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
      const response = (await this.fetchContent(
        contentType,
        { slug: idOrSlug, ...queries },
        headers,
        cache
      )) as CMSContents;

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
      try {
        return (await this.fetchContent(
          `${contentType}/${idOrSlug}`,
          queries,
          headers,
          cache
        )) as CMSContent;
      } catch (error) {
        if (error instanceof FetchError) {
          return {
            message: "Page not found",
            data: error,
          };
        } else {
          console.error("An unknown error occurred:", error);
          return {
            message: "An unknown error occurred:",
            data: error,
          };
        }
      }
    }
  }

  /**
   * Fetches a single image based on its ID or slug, handling response and error cases.
   *
   * @async
   * @param {number} id - The ID of the image to fetch.
   * @param {CMSQueries} [queries] - Optional queries to filter the content.
   * @param {HeadersInit} [headers] - Additional headers to include in the request.
   * @param {RequestCache} [cache] - The caching strategy to use for the request.
   * @returns {Promise<CMSContent | NotFoundContents>} A Promise that resolves with the image content or a "not found" response.
   */
  public async fetchImage(
    id: number,
    queries?: CMSQueries,
    headers?: HeadersInit,
    cache?: RequestCache
  ): Promise<CMSContent | NotFoundContents> {
    const contentType = "images";
    try {
      return (await this.fetchContent(
        `${contentType}/${id}`,
        queries,
        headers,
        cache
      )) as CMSContent;
    } catch (error) {
      if (error instanceof FetchError) {
        return {
          message: "Image not found",
          data: error,
        };
      } else {
        console.error("An unknown error occurred:", error);
        return {
          message: "An unknown error occurred:",
          data: error,
        };
      }
    }
  }

  /**
   * Fetches a single document based on its ID or slug, handling response and error cases.
   *
   * @async
   * @param {number} id - The ID of the document to fetch.
   * @param {CMSQueries} [queries] - Optional queries to filter the content.
   * @param {HeadersInit} [headers] - Additional headers to include in the request.
   * @param {RequestCache} [cache] - The caching strategy to use for the request.
   * @returns {Promise<CMSContent | NotFoundContents>} A Promise that resolves with the document content or a "not found" response.
   */
  public async fetchDocument(
    id: number,
    queries?: CMSQueries,
    headers?: HeadersInit,
    cache?: RequestCache
  ): Promise<CMSContent | NotFoundContents> {
    const contentType = "documents";
    try {
      return (await this.fetchContent(
        `${contentType}/${id}`,
        queries,
        headers,
        cache
      )) as CMSContent;
    } catch (error) {
      if (error instanceof FetchError) {
        return {
          message: "Document not found",
          data: error,
        };
      } else {
        console.error("An unknown error occurred:", error);
        return {
          message: "An unknown error occurred:",
          data: error,
        };
      }
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

  /**
   * Contructs the URL for a media item based on its type.
   * @param {CMSMediaMeta} media - The media item to construct the URL for.
   * @returns {string | undefined} The URL for the media item.
   * Images: the download_url property is a relative URL, so we need to prepend the baseURL.
   * i.e this.baseURL + media.download_url
   * Documents: the download_url property is an absolute URL, so we need to extract the pathname.
   * i.e. this.baseURL + new URL(media.download_url).pathname
   */
  public getMediaSrc(media: CMSMediaMeta): string | undefined {
    if (media.type === "wagtailimages.Image") {
      return this.baseURL + media.download_url;
    } else if (media.type === "wagtaildocs.Document") {
      return this.baseURL + new URL(media.download_url).pathname;
    } else {
      return undefined;
    }
  }
}
