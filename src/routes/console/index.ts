import express from "express";

import ConsoleController from "./ConsoleController";

const consoleController = new ConsoleController();

const consoleRouter = express.Router();
export default consoleRouter;

consoleRouter.get("/", consoleController.execute);
