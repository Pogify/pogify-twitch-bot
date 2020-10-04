import express from "express";

import Logger from "../utils/logger/Logger";
import InitializeRenderEngine from "./InitializeRenderEngine";
import InitializeMiddleware from "./InitializeMiddleware";
import BindRoutes from "./BindRoutes";

export default function Server(): void {
  const app = express();

  app.set("trust proxy", 1);

  InitializeRenderEngine(app);
  InitializeMiddleware.InitializeCommonMiddleware(app);
  BindRoutes(app);

  app.listen(process.env.PORT, () => {
    Logger.getLogger().info(`Server Started on ${process.env.PORT}`);
  });
}
