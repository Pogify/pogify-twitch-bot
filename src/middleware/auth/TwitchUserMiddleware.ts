import { Request, Response, NextFunction } from "express";
import Logger from "../../utils/logger/Logger";
import BaseMiddleware from "../BaseMiddleware";
import { TwitchUser } from "../../service_classes/models/twitch_user/TwitchUser";
import ExtractAuthorizationToken, {
  AuthorizationValidationError,
} from "../../utils/ValidateAuthorizationHeader";

export default class TwitchUserMiddleware extends BaseMiddleware {
  protected async executeImpl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.headers.authorization) {
        this.clientError(res, "missing authorization bearer header");
        return;
      }
      const token = ExtractAuthorizationToken(req.headers.authorization);
      req.twitch = await TwitchUser.FetchUser({ token });
      this.next(next);
    } catch (e) {
      if (e instanceof AuthorizationValidationError) {
        this.clientError(res, e.message);
        return;
      }
      Logger.getLogger().error(e);
      this.fail(res, e);
    }
  }
}
