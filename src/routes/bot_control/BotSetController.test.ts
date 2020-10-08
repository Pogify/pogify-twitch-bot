import { nanoid } from "nanoid";
import { mocked } from "ts-jest/utils";
jest.mock("../../service_classes/twitch_client/TwitchClient");
import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
import BotSetController from "./BotSetController";

let botSetController = new BotSetController();

const req: any = {};
req.twitch = {
  login: nanoid(),
};
req.query = {
  session: nanoid(5),
};

const res: any = {};
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);
res.type = jest.fn();
res.sendStatus = jest.fn().mockReturnValue(res);

const mockedTwitchClient = mocked(TwitchClient);

let failSpy = jest.spyOn(botSetController, "fail");
let okSpy = jest.spyOn(botSetController, "ok");
let clientErrorSpy = jest.spyOn(botSetController, "clientError");

beforeEach(() => {
  jest.clearAllMocks();
  botSetController = new BotSetController();
  failSpy = jest.spyOn(botSetController, "fail");
  okSpy = jest.spyOn(botSetController, "ok");
  clientErrorSpy = jest.spyOn(botSetController, "clientError");
  req.query.sessionId = nanoid(5);
  req.twitch = {
    login: nanoid(),
  };
});

test("test no twitch", async () => {
  req.twitch = undefined;

  await botSetController.execute(req, res);

  expect(mockedTwitchClient.SetSession).not.toBeCalled();
  expect(failSpy).toBeCalled();
  expect(okSpy).not.toBeCalled();
  expect(clientErrorSpy).not.toBeCalled();
});

test("test no sessionId", async () => {
  req.query.sessionId = "";

  await botSetController.execute(req, res);

  expect(mockedTwitchClient.SetSession).not.toBeCalled();
  expect(failSpy).not.toBeCalled();
  expect(okSpy).not.toBeCalled();
  expect(clientErrorSpy).toBeCalled();
});

test("test invalid sessionId", async () => {
  req.query.sessionId = "adfs";

  await botSetController.execute(req, res);

  expect(mockedTwitchClient.SetSession).not.toBeCalled();
  expect(failSpy).not.toBeCalled();
  expect(okSpy).not.toBeCalled();
  expect(clientErrorSpy).toBeCalled();
});
test("test valid sessionId", async () => {
  await botSetController.execute(req, res);

  expect(mockedTwitchClient.SetSession).toBeCalled();
  expect(failSpy).not.toBeCalled();
  expect(okSpy).toBeCalled();
  expect(clientErrorSpy).not.toBeCalled();
});
test("test setsession error", async () => {
  mockedTwitchClient.SetSession.mockRejectedValueOnce(undefined);

  await botSetController.execute(req, res);

  expect(mockedTwitchClient.SetSession).toBeCalled();
  expect(failSpy).toBeCalled();
  expect(okSpy).not.toBeCalled();
  expect(clientErrorSpy).not.toBeCalled();
});
