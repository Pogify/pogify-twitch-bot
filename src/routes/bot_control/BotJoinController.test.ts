import { nanoid } from "nanoid";
jest.mock("../../service_classes/twitch_client/TwitchClient");
import BotJoinController from "./BotJoinController";

import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
import { mocked } from "ts-jest/utils";
let botJoinController = new BotJoinController();
const mockedTwitchClient = mocked(TwitchClient);

const req: any = {};
req.twitch = {
  login: nanoid(),
};

const res: any = {};
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);
res.type = jest.fn();
res.sendStatus = jest.fn().mockReturnValue(res);

let failSpy = jest.spyOn(botJoinController, "fail");
let okSpy = jest.spyOn(botJoinController, "ok");
beforeEach(() => {
  jest.clearAllMocks();
  req.twitch = {
    login: nanoid(),
  };
  botJoinController = new BotJoinController();
  failSpy = jest.spyOn(botJoinController, "fail");
  okSpy = jest.spyOn(botJoinController, "ok");
});

test("test no twitch", async () => {
  req.twitch = undefined;
  await botJoinController.execute(req, res);
  expect(failSpy).toBeCalled();
  expect(okSpy).not.toBeCalled();
});

test("test join", async () => {
  await botJoinController.execute(req, res);
  expect(mockedTwitchClient.JoinChannel).toBeCalled();
  expect(failSpy).not.toBeCalled();
  expect(okSpy).toBeCalled();
});

test("test join error", async () => {
  mockedTwitchClient.JoinChannel.mockRejectedValue("");
  await botJoinController.execute(req, res);
  expect(failSpy).toBeCalled();
  expect(okSpy).not.toBeCalled();
});
