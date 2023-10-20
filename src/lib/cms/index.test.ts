import { fetchRequest } from "../fetch";
import { fetchContent } from "./index"; // Replace with the actual path to your module
import { CMSContentPath, CMSQueries } from "@/types";

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

  beforeEach(() => {
    // Mock the fetchRequest function to return a successful response
    global.fetch = jest.fn().mockResolvedValue(response);
  });

  it("should make a successful GET request to fetch content", async () => {
    const response = await fetchContent(
      baseURL,
      apiPath,
      content,
      queries,
      headers,
      cache
    );

    expect(response).toEqual({ data: "Mock Response" });

    // const fullUrl = `${baseURL}${apiPath}/${content}/?${queries}`;

    // // Ensure that fetchRequest was called with the correct arguments
    // expect(fetchRequest).toHaveBeenCalledWith(
    //   "GET",
    //   fullUrl,
    //   {},
    //   headers,
    //   cache
    // );
  });
});
