import { Request, Response } from "express";

import Logger from "../../utils/logger/Logger";
import BaseController from "../BaseController";
import redirectUri from "../../utils/RedirectUri";
import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
import { TwitchUser } from "../../service_classes/models/twitch_user/TwitchUser";
import { FetchToken } from "../../service_classes/auth/twitch";

export default class InitializeCallbackController extends BaseController {
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      if (TwitchClient.client) {
        this.ok(res, "already initialized");
        return;
      }

      const { state } = req.query;
      const { csrfState } = req.cookies;
      if (state && csrfState && state !== csrfState) {
        res.status(422).send(`Invalid state: ${csrfState} != ${state}`);
        return;
      }

      const token = await FetchToken({
        code: req.query.code as string,
        redirectUri: redirectUri(req.protocol, req.hostname),
      });
      const user = await TwitchUser.FetchUser({ token });

      if (user.display_name !== process.env.BOT_USERNAME) {
        this.forbidden(res, "token not for bot");
        return;
      }

      await TwitchClient.init(token);
      this.ok(res);
    } catch (error) {
      Logger.getLogger().error(error);
      this.fail(res, error);
    }
  }
}
