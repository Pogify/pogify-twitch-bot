import { Router } from "express";
import TwitchUserMiddleware from "../../middleware/auth/TwitchUserMiddleware";
import BotCurrentController from "./BotCurrentController";
import BotJoinController from "./BotJoinController";
import BotPartController from "./BotPartController";
import BotSetController from "./BotSetController";

const botJoinController = new BotJoinController();
const botPartController = new BotPartController();
const botSetController = new BotSetController();
const botCurrentController = new BotCurrentController();

const twitchUserMiddleware = new TwitchUserMiddleware();

const botControlRouter = Router();
export default botControlRouter;

botControlRouter.use(twitchUserMiddleware.execute);
botControlRouter.post("/join", botJoinController.execute);
botControlRouter.post("/part", botPartController.execute);
botControlRouter.post("/set", botSetController.execute);
botControlRouter.get("/current", botCurrentController.execute);
