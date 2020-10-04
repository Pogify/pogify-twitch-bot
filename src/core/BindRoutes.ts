import { Express } from "express";

import consoleRouter from "../routes/console";
import initializeRouter from "../routes/initialize";
import botControlRouter from "../routes/bot_control";

export default function BindRoutes(app: Express): void {
  app.use("/", consoleRouter);
  app.use("/init", initializeRouter);
  app.use("/", botControlRouter);
}
