import { FetchError } from "@/lib";

export interface ClientOptions {
  baseURL: string;
  apiPath: string;
  headers?: HeadersInit;
  cache?: RequestCache;
}

export type CMSQueries = {
  type?: string;
  slug?: string;
  fields?: string[];
  limit?: number;
  offset?: number;
  order?: string;
  search?: string;
  search_operator?: string;
  locale?: string;
  translation_of?: string;
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
  //   TODO
  locale: "en" | "fr" | "de" | "es" | "it" | "ja" | "ko" | "pt" | string;
  html_url: string;
  detail_url: string;
  seo_title?: string;
  search_description?: string;
}

export interface CMSMediaMeta {
  type: string;
  detail_url: string;
  tags?: string[];
  download_url?: string;
}

export interface CMSContent {
  id: number;
  title: string;
  meta: CMSPageMeta | CMSMediaMeta;
  [key: string]: any; // Index signature for additional fields
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
