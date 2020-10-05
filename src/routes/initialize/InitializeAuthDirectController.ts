import { Request, Response } from "express";
import redirectUri from "../../utils/RedirectUri";
import Logger from "../../utils/logger/Logger";
import BaseController from "../BaseController";
import TwitchConstants from "../../constants/TwitchConstants.json";

export default class InitialzeAuthDirectController extends BaseController {
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const params = new URLSearchParams();
      params.set(
        "redirect_uri",
        redirectUri(req.protocol, req.hostname, "/init/callback")
      );
      params.set("scope", "chat:read chat:edit");
      params.set("response_type", "code");
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      params.set("client_id", process.env.TWITCH_CLIENT_ID!);
      params.set("force_verify", "true");

      res.redirect(`${TwitchConstants.authorize}?${params.toString()}`);
    } catch (e) {
      Logger.getLogger().error(`uncaught error in ${this.constructor.name}`);
      Logger.getLogger().error(e.toString());
      this.fail(res, e);
    }
  }
}
