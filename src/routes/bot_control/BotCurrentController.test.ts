jest.mock("../../DB_interface/channel_session");
import { nanoid } from "nanoid";
import { mocked } from "ts-jest/utils";
import * as DBI from "../../DB_interface/channel_session";
import BotCurrentController from "./BotCurrentController";

const mockedDBI = mocked(DBI, true);

let botControllerController = new BotCurrentController();
let failSpy = jest.spyOn(botControllerController, "fail");
let okSpy = jest.spyOn(botControllerController, "ok");
let notFoundSpy = jest.spyOn(botControllerController, "notFound");

beforeEach(() => {
  jest.clearAllMocks();
  botControllerController = new BotCurrentController();
  failSpy = jest.spyOn(botControllerController, "fail");
  okSpy = jest.spyOn(botControllerController, "ok");
  notFoundSpy = jest.spyOn(botControllerController, "notFound");
  req.twitch = {
    login: nanoid(),
  };
});

const req: any = {};
req.twitch = {
  login: nanoid(),
};

const res: any = {};
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);
res.type = jest.fn();

test("test no twitch", async () => {
  req.twitch = undefined;
  await botControllerController.execute(req, res);
  expect(failSpy).toBeCalled();
});

test("test sessionId exists", async () => {
  const mockSessionId = nanoid();
  mockedDBI.getSessionFromDB.mockResolvedValueOnce(mockSessionId);
  await botControllerController.execute(req, res);

  expect(okSpy).toBeCalledWith(res, mockSessionId);
  expect(failSpy).not.toBeCalled();
  expect(notFoundSpy).not.toBeCalled();
});

test("test sessionId doesn't exist for channel", async () => {
  mockedDBI.getSessionFromDB.mockResolvedValueOnce("");
  await botControllerController.execute(req, res);

  expect(okSpy).not.toBeCalled();
  expect(failSpy).not.toBeCalled();
  expect(notFoundSpy).toBeCalled();
});

test("test dbi fail", async () => {
  mockedDBI.getSessionFromDB.mockRejectedValueOnce(" ");
  await botControllerController.execute(req, res);

  expect(okSpy).not.toBeCalled();
  expect(failSpy).toBeCalled();
  expect(notFoundSpy).not.toBeCalled();
});
