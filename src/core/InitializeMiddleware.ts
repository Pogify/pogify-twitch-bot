import { Express } from "express";
import CommonMiddleware from "../middleware/CommonMiddleware";

export default class InitializeMiddleware {
  public static InitializeCommonMiddleware(app: Express): void {
    const commonMiddleware = new CommonMiddleware(app);

    commonMiddleware.useCookieParser();
    commonMiddleware.useCors();
    commonMiddleware.useStaticFolder();
  }
}
