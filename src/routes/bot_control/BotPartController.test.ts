import { nanoid } from "nanoid";
import { mocked } from "ts-jest/utils";
import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
jest.mock("../../service_classes/twitch_client/TwitchClient");
import BotPartController from "./BotPartController";

let botPartController = new BotPartController();

const req: any = {};
req.twitch = {
  login: nanoid(),
};

const res: any = {};
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);
res.type = jest.fn();
res.sendStatus = jest.fn().mockReturnValue(res);

const mockedTwitchClient = mocked(TwitchClient, true);

let failSpy = jest.spyOn(botPartController, "fail");
let okSpy = jest.spyOn(botPartController, "ok");

beforeEach(() => {
  jest.clearAllMocks();
  botPartController = new BotPartController();
  failSpy = jest.spyOn(botPartController, "fail");
  okSpy = jest.spyOn(botPartController, "ok");
  req.twitch = {
    login: nanoid(),
  };
});

test("test no twitch", async () => {
  req.twitch = undefined;

  await botPartController.execute(req, res);

  expect(failSpy).toBeCalled();
  expect(mockedTwitchClient.PartFromChannel).not.toBeCalled();
  expect(okSpy).not.toBeCalled();
});

test("test part", async () => {
  await botPartController.execute(req, res);

  expect(failSpy).not.toBeCalled();
  expect(mockedTwitchClient.PartFromChannel).toBeCalled();
  expect(okSpy).toBeCalled();
});

test("test part error", async () => {
  mockedTwitchClient.PartFromChannel.mockRejectedValueOnce(undefined);

  await botPartController.execute(req, res);

  expect(failSpy).toBeCalled();
  expect(mockedTwitchClient.PartFromChannel).toBeCalled();
  expect(okSpy).not.toBeCalled();
});
