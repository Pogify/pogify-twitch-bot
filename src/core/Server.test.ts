import Server from "./server";

test("test paths", () => {
  const app = Server();

  expect(app._router.stack).toMatchSnapshot();
});
