import express from "express";

import InitializeRenderEngine from "./InitializeRenderEngine";
import InitializeMiddleware from "./InitializeMiddleware";
import BindRoutes from "./BindRoutes";

export default function Server(): express.Express {
  const app = express();

  app.set("trust proxy", 1);

  InitializeRenderEngine(app);
  InitializeMiddleware.InitializeCommonMiddleware(app);
  BindRoutes(app);

  return app;
}
