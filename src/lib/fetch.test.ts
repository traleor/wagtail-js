describe("hello world", () => {
  it("should work", () => {
    console.log("FETCH", process.env.CMS_API_URL);
    expect(true).toBe(true);
  });
});
