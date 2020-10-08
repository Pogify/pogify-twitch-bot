import express from "express";
import InitializeMiddleware from "./InitializeMiddleware";

test("test bind middleware", () => {
  const app = express();

  InitializeMiddleware.InitializeCommonMiddleware(app);

  expect(app._router.stack).toMatchSnapshot();
});
