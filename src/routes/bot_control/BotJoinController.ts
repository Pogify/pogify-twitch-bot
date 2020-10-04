import { Request, Response } from "express";
import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
import Logger from "../../utils/logger/Logger";
import BaseController from "../BaseController";

export default class BotJoinController extends BaseController {
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      if (!req.twitch) {
        Logger.getLogger().error("missing twitch user object");
        this.fail(res, "internal server error");
        return;
      }

      const channel = `#${req.twitch.login}`;
      await TwitchClient.JoinChannel({ channel });
      this.ok(res);
    } catch (e) {
      Logger.getLogger().error(e);
      this.fail(res, e);
    }
  }
}
