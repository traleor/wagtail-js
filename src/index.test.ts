// hello world test

describe("hello world", () => {
  it("should work", () => {
    console.log("hello world", process.env.NODE_ENV)
    expect(true).toBe(true);
  });
});
