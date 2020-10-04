import { Router } from "express";
import InitializeCallbackController from "./InitializeCallbackController";
import InitializeController from "./InitializeController";

const initializeController = new InitializeController();
const initializeCallbackController = new InitializeCallbackController();

const initializeRouter = Router();
export default initializeRouter;

initializeRouter.get("/", initializeController.execute);
initializeRouter.get("/callback", initializeCallbackController.execute);
