import { Request, Response } from "express";
import BaseHandler from "../BaseHandler";
import Logger from "../utils/logger/Logger";

export default abstract class BaseController extends BaseHandler {
  protected abstract executeImpl(
    /* eslint-disable */
    req: Request,
    res: Response
  ): /* eslint-enable */
  Promise<void>;

  public execute = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.executeImpl(req, res);
    } catch (e) {
      Logger.getLogger().error("[BaseController]: Uncaught controller error");
      Logger.getLogger().error(e);
      this.fail(res, "An unexpected error occurred");
    }
  };
}
