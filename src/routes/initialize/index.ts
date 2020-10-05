import { Router } from "express";
import CsrfTokenIssueMiddleware from "../../middleware/auth/CsrfTokenIssueMiddleware";
import CsrfTokenVerifyMiddleware from "../../middleware/auth/CsrfTokenVerifyMiddleware";
import InitializeAuthDirectController from "./InitializeAuthDirectController";
import InitializeCallbackController from "./InitializeCallbackController";
import InitializeController from "./InitializeController";

const initializeController = new InitializeController();
const initializeAuthDirectController = new InitializeAuthDirectController();
const initializeCallbackController = new InitializeCallbackController();
const csrfTokenIssueMiddleware = new CsrfTokenIssueMiddleware();
const csrfTokenVerifyMiddleware = new CsrfTokenVerifyMiddleware();

const initializeRouter = Router();
export default initializeRouter;

initializeRouter.get("/", initializeController.execute);

initializeRouter.get(
  "/authorize",
  csrfTokenIssueMiddleware.execute,
  initializeAuthDirectController.execute
);
initializeRouter.get(
  "/callback",
  csrfTokenVerifyMiddleware.execute,
  initializeCallbackController.execute
);
