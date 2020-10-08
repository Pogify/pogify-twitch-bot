import { NextFunction, Request, Response } from "express";
import TwitchClient from "../service_classes/twitch_client/TwitchClient";
import BaseMiddleware from "./BaseMiddleware";

export default class NotInitMiddleware extends BaseMiddleware {
  initialized = false;

  protected async executeImpl(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (this.initialized) {
      this.next(next);
    } else if (TwitchClient.client) {
      this.initialized = true;
      this.next(next);
    } else {
      res.status(503).send("bot not initialized");
    }
  }
}
