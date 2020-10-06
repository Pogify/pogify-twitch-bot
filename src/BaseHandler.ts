/* eslint class-methods-use-this: "off" */

import { NextFunction, Request, Response } from "express";
import Logger from "./utils/logger/Logger";

export default abstract class BaseHandler {
  protected abstract executeImpl(
    /* eslint-disable */
    // eslint throws error here for some reason
    req: Request,
    res: Response,
    next?: NextFunction
  ): /* eslint-enable */
  Promise<void>;

  public abstract async execute(
    /* eslint-disable */
    // eslint throws error here for some reason
    req: Request,
    res: Response,
    next?: NextFunction
  ): /* eslint-enable */
  Promise<void>;

  public ok<T>(res: Response, dto?: T): Response<unknown> {
    if (dto) {
      res.type("application/json");
      return res.status(200).json(dto);
    }
    return res.sendStatus(200);
  }

  public static jsonResponse(
    res: Response,
    code: number,
    message: string
  ): Response<unknown> {
    return res.status(code).json({ code, message });
  }

  public created(res: Response): Response<unknown> {
    return res.sendStatus(201);
  }

  public clientError(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 400, message || "Client Error");
  }

  public unauthorized(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 401, message || "Unauthorized");
  }

  public paymentRequired(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 402, message || "Payment Required");
  }

  public forbidden(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 403, message || "Forbidden");
  }

  public notFound(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 404, message || "Not Found");
  }

  public conflict(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 409, message || "Conflict");
  }

  public tooMany(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 429, message || "Too Many Requests");
  }

  public todo(res: Response): Response<unknown> {
    return BaseHandler.jsonResponse(res, 400, "TODO");
  }

  public fail(res: Response, error?: Error | string): Response<unknown> {
    return BaseHandler.jsonResponse(
      res,
      500,
      error?.toString() ?? "An Error Occurred"
    );
  }

  public uncaughtError(res: Response, message: string): void;

  public uncaughtError(res: Response, error: Error, message?: string): void;

  public uncaughtError(
    res: Response,
    error: Error | string,
    message?: string
  ): void {
    Logger.getLogger().error(`uncaught error in ${this.constructor.name}`);
    Logger.getLogger().error(message || error.toString());
    if (message) {
      Logger.getLogger().error(error.toString());
    }

    if (typeof error === "string" && !message) {
      // eslint-disable-next-line no-param-reassign
      message = error;
    }
    this.fail(res, message ?? "An Error Occurred");
  }
}
