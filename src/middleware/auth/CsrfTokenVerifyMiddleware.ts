import { NextFunction, Request, Response } from "express";

import Logger from "../../utils/logger/Logger";
import BaseMiddleware from "../BaseMiddleware";
import CsrfTokenConstants from "../../constants/CsrfTokenConstants.json";

export default class CsrfTokenVerifyMiddleware extends BaseMiddleware {
  protected async executeImpl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { state } = req.query;
      const csrfState = req.cookies[CsrfTokenConstants.cookieName];
      if (
        state !== csrfState ||
        state === undefined ||
        csrfState === undefined
      ) {
        res.status(422).send(`Invalid state: ${csrfState} != ${state}`);
        return;
      }

      this.next(next);
    } catch (e) {
      Logger.getLogger().error("uncaught controller error");
      Logger.getLogger().error(e);
      this.fail(res, "An unexpected error occurred");
    }
  }
}
