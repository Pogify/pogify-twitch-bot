import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import StaticFolderConfig from "@configs/StaticContentConfig.json";
import path from "path";

export default class CommonMiddleware {
  public app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  useCors(): void {
    this.app.use(cors());
  }

  useStaticFolder(): void {
    this.app.use(
      StaticFolderConfig.endpoint,
      express.static(path.join(process.cwd(), StaticFolderConfig.path))
    );
  }

  useCookieParser(): void {
    this.app.use(cookieParser(process.env.COOKIE_SECRET));
  }
}
