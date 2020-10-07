import request from "supertest";
import consoleRouter from ".";
import express from "express";
import InitializeRenderEngine from "../../core/InitializeRenderEngine";

let app: express.Express;
beforeEach(() => {
  app = express();
  InitializeRenderEngine(app);
});

test("test paths", async () => {
  app.use("/", consoleRouter);

  let res = await request(app).get("/");
  console.log(res.body);
  expect(res.status).toBe(200);
  expect(res.body).toMatchSnapshot();
});
