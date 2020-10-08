import InitializeRenderEngine from "./InitializeRenderEngine";
import express from "express";

test("test render engine bind", () => {
  const app = express();
  InitializeRenderEngine(app);

  // @ts-ignore
  expect(app.engines).toMatchInlineSnapshot(`
    Object {
      ".html": [Function],
    }
  `);

  expect(app.locals.settings.views).toMatch(/public/);
});
