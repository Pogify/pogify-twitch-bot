import { Request, Response } from "express";
import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
import BaseController from "../BaseController";

export default class ConsoleController extends BaseController {
  public async executeImpl(_: Request, res: Response): Promise<void> {
    try {
      res.render("index.html", {
        client_id: process.env.TWITCH_CLIENT_ID,
        initialized: !!TwitchClient.client,
      });
    } catch (e) {
      this.fail(res, e);
    }
  }
}
