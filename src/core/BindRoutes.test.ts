import BindRoutes from "./BindRoutes";
import express from "express";

test("test bindRoutes", () => {
  const app = express();

  BindRoutes(app);
  expect(app._router.stack).toMatchSnapshot();
});
