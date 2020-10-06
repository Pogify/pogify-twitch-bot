import { Request, Response } from "express";
import Logger from "../../utils/logger/Logger";
import BaseController from "../BaseController";
import * as DBI from "../../DB_interface/channel_session";

export default class BotCurrentController extends BaseController {
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      if (!req.twitch) {
        Logger.getLogger().error("missing twitch user object");
        this.fail(res, "internal server error");
        return;
      }

      const sessionId = await DBI.getSessionFromDB(`#${req.twitch.login}`);

      if (sessionId) {
        this.ok(res, sessionId);
        return;
      }
      this.notFound(res, `no session id set for ${req.twitch.login}`);
    } catch (e) {
      Logger.getLogger().error(e);
      this.fail(res, e);
    }
  }
}
