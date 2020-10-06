import redirectUri from "./RedirectUri";

const port = "1000";
beforeAll(() => {
  process.env.PORT = port;
});

test("test localhost", () => {
  let testCases = [
    {
      args: { proto: "http", host: "localhost", path: "" },
      expect: `http://localhost:${port}`,
    },
    {
      args: { proto: "https", host: "localhost", path: "" },
      expect: `https://localhost:${port}`,
    },
    {
      args: { proto: "https", host: "localhost", path: "/testpath" },
      expect: `https://localhost:${port}/testpath`,
    },
    {
      args: { proto: "https", host: "localhost", path: "testpath" },
      expect: `https://localhost:${port}/testpath`,
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const element = testCases[i];
    const { proto, host, path } = element.args;
    expect(redirectUri(proto, host, path)).toBe(element.expect);
  }
});
test("test other", () => {
  let testCases = [
    {
      args: { proto: "http", host: "test.com" },
      expect: `http://test.com`,
    },
    {
      args: { proto: "https", host: "www.test.com" },
      expect: `https://www.test.com`,
    },
    {
      args: { proto: "https", host: "api.test.com", path: "/testpath" },
      expect: `https://api.test.com/testpath`,
    },
    {
      args: { proto: "https", host: "api.test.com", path: "testpath" },
      expect: `https://api.test.com/testpath`,
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const element = testCases[i];
    const { proto, host, path } = element.args;
    expect(redirectUri(proto, host, path)).toBe(element.expect);
  }
});
