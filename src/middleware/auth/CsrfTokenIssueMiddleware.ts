import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import BaseMiddleware from "../BaseMiddleware";
import CsrfTokenConstants from "../../constants/CsrfTokenConstants.json";

export default class CsrfTokenIssueMiddleware extends BaseMiddleware {
  protected async executeImpl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const csrfToken = nanoid();
      res.cookie(CsrfTokenConstants.cookieName, csrfToken, {
        signed: true,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });
      req.csrfToken = csrfToken;
      this.next(next);
    } catch (e) {
      this.uncaughtError(res, e);
    }
  }
}
