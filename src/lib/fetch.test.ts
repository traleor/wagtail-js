import { fetchRequest, FetchError } from "./fetch";

describe("fetchRequest", () => {
  it("should make a successful GET request", async () => {
    // Mock the fetch function to return a successful response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => ({ message: "Success" }),
    });

    const response = await fetchRequest("GET", "https://example.com/api", null);

    expect(response).toEqual({ message: "Success" });
  });

  it("should handle a failed GET request", async () => {
    // Mock the fetch function to return a non-ok (failed) response
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    try {
      await fetchRequest("GET", "https://example.com/api", null);
    } catch (error: any) {
      expect(error).toBeInstanceOf(FetchError);
      expect(error.code).toBe("REQUEST_FAILED");
    }
  });

  it("should handle an unexpected error", async () => {
    // Mock the fetch function to throw an unexpected error
    global.fetch = jest.fn().mockRejectedValue(new Error("Unexpected error"));

    try {
      await fetchRequest("GET", "https://example.com/api", null);
    } catch (error: any) {
      expect(error).toBeInstanceOf(FetchError);
      expect(error.code).toBe("UNEXPECTED_ERROR");
    }
  });
});
