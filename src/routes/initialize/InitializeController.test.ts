import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
import InitializeController from "./InitializeController";

let initializeController = new InitializeController();

const req: any = {};
const res: any = {};
res.render = jest.fn().mockReturnValue(res);
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);
res.type = jest.fn().mockImplementation(res);

let failSpy = jest.spyOn(initializeController, "fail");

beforeEach(() => {
  jest.clearAllMocks();
  initializeController = new InitializeController();
});

test("test not init", async () => {
  await initializeController.execute(req, res);
  expect(res.render).toBeCalled();
});

test("test inited already", async () => {
  // @ts-expect-error truthy value
  TwitchClient.client = "something";
  initializeController.ok = jest.fn();
  await initializeController.execute(res, res);
  expect(res.render).not.toBeCalled();
  expect(initializeController.ok).toBeCalled();
});

test("test error", async () => {
  const failSpy = jest.spyOn(initializeController, "fail");
  res.render.mockImplementation(() => {
    throw new Error();
  });

  await initializeController.execute(req, res);
  expect(failSpy).toBeCalled();
});
