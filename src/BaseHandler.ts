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
    return res.status(code).json({ message });
  }

  public created(res: Response): Response<unknown> {
    return res.sendStatus(201);
  }

  public clientError(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 400, message || "Unauthorized");
  }

  public unauthorized(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 401, message || "Unauthorized");
  }

  public paymentRequired(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 402, message || "Payment required");
  }

  public forbidden(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 403, message || "Forbidden");
  }

  public notFound(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 404, message || "Not found");
  }

  public conflict(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 409, message || "Conflict");
  }

  public tooMany(res: Response, message?: string): Response<unknown> {
    return BaseHandler.jsonResponse(res, 429, message || "Too many requests");
  }

  public todo(res: Response): Response<unknown> {
    return BaseHandler.jsonResponse(res, 400, "TODO");
  }

  public fail(res: Response, error: Error | string): Response<unknown> {
    Logger.getLogger().error(error.toString());
    return res.status(500).json({
      message: error.toString(),
    });
  }
}
