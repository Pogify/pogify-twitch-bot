import { Request, Response } from "express";
import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
import validateSessionID from "../../utils/ValidateSessionID";
import Logger from "../../utils/logger/Logger";
import BaseController from "../BaseController";

export default class BotSetController extends BaseController {
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      if (!req.twitch) {
        Logger.getLogger().error("missing twitch user object");
        this.fail(res, "internal server error");
        return;
      }

      const sessionId = req.query.sessionId as string;
      if (!sessionId) {
        this.clientError(res, "missing sessionId param");
        return;
      }

      if (!validateSessionID(sessionId)) {
        this.clientError(res, "invalid sessionId");
        return;
      }

      await TwitchClient.SetSession({
        channel: `#${req.twitch.login}`,
        sessionId: req.query.sessionId as string,
      });
      this.ok(res);
    } catch (e) {
      Logger.getLogger().error(e);
      this.fail(res, e);
    }
  }
}
