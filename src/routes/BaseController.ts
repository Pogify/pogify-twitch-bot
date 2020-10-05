import { Request, Response } from "express";
import BaseHandler from "../BaseHandler";

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
      this.uncaughtError(res, e, "[BaseController]: Uncaught controller error");
    }
  };
}
