import { Request, Response } from "express";

import Logger from "../../utils/logger/Logger";
import BaseController from "../BaseController";
import redirectUri from "../../utils/RedirectUri";
import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
import { TwitchUser } from "../../service_classes/models/twitch_user/TwitchUser";
import { FetchToken } from "../../service_classes/auth/twitch";

const { BOT_USERNAME } = process.env;

export default class InitializeCallbackController extends BaseController {
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      if (TwitchClient.client) {
        this.ok(res, "already initialized");
        return;
      }

      if (!req.query.code) {
        this.clientError(res, "missing code");
        return;
      }

      let token: string;
      try {
        token = await FetchToken({
          code: req.query.code.toString(),
          redirectUri: redirectUri(
            req.protocol,
            req.hostname,
            "/init/callback"
          ),
        });
      } catch (err) {
        if (err.response && err.response.status > 499) {
          Logger.getLogger().info(JSON.stringify(err));
          this.fail(res, err);
        } else {
          this.clientError(res, err.toString());
        }
        return;
      }

      // guaranteed to return a user since token is fetched internally
      // any error would be server side
      const user = await TwitchUser.FetchUser({ token });
      if (user.login !== BOT_USERNAME) {
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
