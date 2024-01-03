import { FetchError } from "@/lib";

export interface ClientOptions {
  baseURL: string;
  mediaBaseURL?: string;
  apiPath: string;
  headers?: HeadersInit;
  cache?: RequestCache;
}

/**
 * CMS queries.
 * @typedef {Object} CMSQueries
 * @property {string} [type] - The type of content to fetch.
 * @property {number} [offset] - The number of items to skip.
 * @property {number} [limit] - The maximum number of items to return.
 * @property {string} [slug] - The slug of the content to fetch.
 * @property {number} [child_of] - The ID of the parent page to fetch child pages for.
 * @property {number} [ancestor_of] - The ID of the page to fetch ancestor pages for.
 * @property {number} [decendant_of] - The ID of the page to fetch decendant pages for.
 * @property {string} [site] - The site hostname to fetch content for.
 * @property {string} [search] - The search term to filter the results by.
 * @property {string} [search_operator] - The search operator to use for filtering the results.
 * @property {string} [locale] - The locale to filter the results by.
 * @property {number} [translation_of] - The ID of the page to fetch translations for.
 * @property {string[]} [fields] - The fields to include in the response.
 * @property {string} [order] - The field to order the results by.
 * @property {boolean} [show_in_menus] - Whether to filter the results by pages that are shown in menus.
 *
 * @see https://docs.wagtail.org/en/stable/advanced_topics/api/v2/usage.html
 * @see https://docs.wagtail.org/en/stable/advanced_topics/api/v2/usage.html#filtering
 * @see https://docs.wagtail.org/en/stable/advanced_topics/api/v2/usage.html#ordering
 * @see https://docs.wagtail.org/en/stable/advanced_topics/api/v2/usage.html#searching
 * @see https://docs.wagtail.org/en/stable/advanced_topics/api/v2/usage.html#localization
 * @see https://docs.wagtail.org/en/stable/advanced_topics/api/v2/usage.html#pagination
 * @see https://docs.wagtail.org/en/stable/advanced_topics/api/v2/usage.html#fields
 *
 * @example
 * const queries = {
 * type: 'pages',
 * child_of: 1,
 * fields: ['id', 'title', 'slug'],
 * limit: 10,
 * offset: 10,
 * order: '-title',
 * search: 'hello',
 * search_operator: 'and',
 * locale: 'en',
 * translation_of: 1,
 * show_in_menus: true,
 * };
 *
 * */
export type CMSQueries = {
  type?: string;
  offset?: number;
  limit?: number;
  order?: string;
  slug?: string;
  child_of?: number;
  ancestor_of?: number;
  decendant_of?: number;
  site?: string;
  search?: string;
  search_operator?: string;
  locale?: string;
  translation_of?: number;
  fields?: string[];
  show_in_menus?: boolean;
  [key: string]: string | number | boolean | string[] | number[] | undefined;
};

export type CMSContentPath =
  | "pages"
  | `pages/${number}`
  | "images"
  | `images/${number}`
  | "documents"
  | `documents/${number}`;

export interface CMSPageMeta {
  slug: string;
  type: string;
  locale: string;
  html_url: string;
  detail_url: string;
  seo_title?: string;
  search_description?: string;
}

export interface CMSMediaMeta {
  type: string;
  detail_url: string;
  tags?: string[];
  download_url: string;
}

export interface CMSContent {
  id: number;
  title: string;
  meta: CMSPageMeta | CMSMediaMeta;
}

export interface CMSContents {
  meta: {
    total_count: number;
  };
  items: CMSContent[];
}

export interface NotFoundContents {
  message: string;
  data: CMSContent | CMSContents | FetchError | unknown;
}
