import { CMSQueries } from "@/types";
import { buildQueryString } from "./index";

describe("buildQueryString", () => {
  it("should return an empty string for undefined queries", () => {
    const queries: CMSQueries | undefined = undefined;
    const queryString = buildQueryString(queries);
    expect(queryString).toBe("");
  });

  it("should build a valid query string with various query parameters", () => {
    const queries: CMSQueries = {
      type: "article",
      limit: 10,
      search: "example",
      fields: ["title", "content"],
    };

    const queryString = buildQueryString(queries);
    expect(queryString).toBe(
      "type=article&limit=10&search=example&fields=title,content"
    );
  });

  it("should handle undefined query parameters", () => {
    const queries: CMSQueries = {
      type: "article",
      limit: undefined,
      search: "example",
      fields: ["title", "content"],
    };

    const queryString = buildQueryString(queries);
    expect(queryString).toBe(
      "type=article&search=example&fields=title,content"
    );
  });

  it("should handle empty string query parameters", () => {
    const queries: CMSQueries = {
      type: "article",
      test: "",
      search: "example",
      fields: ["title", "content"],
    };

    const queryString = buildQueryString(queries);
    expect(queryString).toBe(
      "type=article&search=example&fields=title,content"
    );
  });

  it("should handle array query parameters", () => {
    const queries: CMSQueries = {
      type: "article",
      tags: ["tag1", "tag2", "tag3"],
    };

    const queryString = buildQueryString(queries);
    expect(queryString).toBe("type=article&tags=tag1,tag2,tag3");
  });
});
