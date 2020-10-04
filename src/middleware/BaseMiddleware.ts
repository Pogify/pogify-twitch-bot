/* eslint class-methods-use-this: off */
import { NextFunction, Request, Response } from "express";
import BaseHandler from "../BaseHandler";
import Logger from "../utils/logger/Logger";

export default abstract class BaseMiddleware extends BaseHandler {
  protected abstract executeImpl(
    /* eslint-disable */
    req: Request,
    res: Response,
    next: NextFunction
  ): /* eslint-enable */
  Promise<void>;

  public next(next: NextFunction, err?: Error): void {
    next(err);
  }

  public execute = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.executeImpl(req, res, next);
    } catch (e) {
      Logger.getLogger().error("[BaseHandler]: Uncaught controller error");
      Logger.getLogger().error(e);
      this.fail(res, "An unexpected error occurred");
    }
  };
}
