import { Request, Response } from "express";
import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
import Logger from "../../utils/logger/Logger";
import BaseController from "../BaseController";

export default class InitializeController extends BaseController {
  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      if (TwitchClient.client) {
        this.ok(res, "chatbot already initialized");
      } else {
        res.render("init.html", { client_id: process.env.TWITCH_CLIENT_ID });
      }
    } catch (e) {
      Logger.getLogger().error(e.toString());
      this.fail(res, e);
    }
  }
}
