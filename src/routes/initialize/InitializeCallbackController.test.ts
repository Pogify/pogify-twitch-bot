import { nanoid } from "nanoid";
import { mocked } from "ts-jest/utils";
const mockUsername = nanoid();
process.env.BOT_USERNAME = mockUsername;
jest.mock("../../service_classes/models/twitch_user/TwitchUser");
jest.mock("../../service_classes/auth/twitch");
jest.mock("../../service_classes/twitch_client/TwitchClient");

import {
  TTwitchUser,
  TwitchUser,
} from "../../service_classes/models/twitch_user/TwitchUser";
import { FetchToken } from "../../service_classes/auth/twitch";
import TwitchClient from "../../service_classes/twitch_client/TwitchClient";
// @ts-expect-error partial return
TwitchUser.FetchUser.mockImplementation(() => ({
  login: mockUsername,
}));
import InitializeCallbackController from "./InitializeCallbackController";

const mockedTwitchUser = mocked(TwitchUser, true);
const mockedFetchToken = mocked(FetchToken, true);
const mockedTwitchClient = mocked(TwitchClient, true);

const req: any = {};
req.query = {};

const res: any = {};

let initializeCallbackController = new InitializeCallbackController();

beforeEach(() => {
  jest.resetAllMocks();
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.type = jest.fn().mockReturnValue(res);
  initializeCallbackController = new InitializeCallbackController();
  mockedTwitchClient.client = undefined;
  req.query = {};
});

test("test already inited", async () => {
  const okSpy = jest.spyOn(initializeCallbackController, "ok");
  const spyFail = jest.spyOn(initializeCallbackController, "fail");
  // @ts-expect-error manually set truthy value
  mockedTwitchClient.client = "truthyvalue";

  await initializeCallbackController.execute(req, res);
  expect(okSpy).toBeCalled();
  expect(spyFail).not.toBeCalled();
});

describe("test not inited", () => {
  test("no code", async () => {
    const okSpy = jest.spyOn(initializeCallbackController, "ok");
    const clientErrorSpy = jest.spyOn(
      initializeCallbackController,
      "clientError"
    );

    await initializeCallbackController.execute(req, res);

    expect(okSpy).not.toBeCalled();
    expect(clientErrorSpy).toBeCalled();
  });

  test("w/ valid code", async () => {
    const mockToken = nanoid();
    const mockCode = nanoid();
    req.query = {
      code: mockCode,
    };
    mockedFetchToken.mockResolvedValueOnce(mockToken);
    mockedTwitchUser.FetchUser.mockResolvedValueOnce({} as TTwitchUser);

    await initializeCallbackController.execute(req, res);

    expect(mockedFetchToken).toBeCalled();
    expect(mockedTwitchUser.FetchUser).toBeCalled();
  });

  describe("w/o valid code", () => {
    test("4xx err", async () => {
      const okSpy = jest.spyOn(initializeCallbackController, "ok");
      const clientErrorSpy = jest.spyOn(
        initializeCallbackController,
        "clientError"
      );
      const failSpy = jest.spyOn(initializeCallbackController, "fail");

      const mockCode = nanoid();
      req.query = {
        code: mockCode,
      };
      mockedFetchToken.mockRejectedValueOnce({ response: { status: 400 } });
      mockedTwitchUser.FetchUser.mockResolvedValueOnce({} as TTwitchUser);

      await initializeCallbackController.execute(req, res);

      expect(mockedFetchToken).toBeCalled();
      expect(okSpy).not.toBeCalled();
      expect(failSpy).not.toBeCalled();
      expect(clientErrorSpy).toBeCalled();
      expect(mockedTwitchUser.FetchUser).not.toBeCalled();
    });
    test("5xx err", async () => {
      const okSpy = jest.spyOn(initializeCallbackController, "ok");
      const clientErrorSpy = jest.spyOn(
        initializeCallbackController,
        "clientError"
      );
      const failSpy = jest.spyOn(initializeCallbackController, "fail");

      const mockCode = nanoid();
      req.query = {
        code: mockCode,
      };
      mockedFetchToken.mockRejectedValueOnce({ response: { status: 500 } });
      mockedTwitchUser.FetchUser.mockResolvedValueOnce({} as TTwitchUser);

      await initializeCallbackController.execute(req, res);

      expect(mockedFetchToken).toBeCalled();
      expect(okSpy).not.toBeCalled();
      expect(clientErrorSpy).not.toBeCalled();
      expect(failSpy).toBeCalled();
      expect(mockedTwitchUser.FetchUser).not.toBeCalled();
    });
  });

  test("matched with env bot", async () => {
    jest.resetModules();
    const forbiddenSpy = jest.spyOn(initializeCallbackController, "forbidden");
    const okSpy = jest.spyOn(initializeCallbackController, "ok");
    req.query = {
      code: nanoid(),
    };

    // @ts-expect-error partial return
    mockedTwitchUser.FetchUser.mockResolvedValue({ login: mockUsername });
    mockedTwitchClient.init.mockResolvedValue();

    await initializeCallbackController.execute(req, res);

    expect(mockedTwitchUser.FetchUser).toBeCalled();
    expect(mockedTwitchClient.init).toBeCalled();
    expect(forbiddenSpy).not.toBeCalled();
    expect(okSpy).toBeCalled();
  });

  test("not matched with env bot", async () => {
    const forbiddenSpy = jest.spyOn(initializeCallbackController, "forbidden");
    const okSpy = jest.spyOn(initializeCallbackController, "ok");
    req.query = {
      code: nanoid(),
    };

    // @ts-expect-error partial return
    mockedTwitchUser.FetchUser.mockResolvedValue({ login: nanoid() });
    mockedTwitchClient.init.mockResolvedValue();

    await initializeCallbackController.execute(req, res);
    expect(mockedTwitchUser.FetchUser).toBeCalled();
    expect(forbiddenSpy).toBeCalled();
    expect(okSpy).not.toBeCalled();
    expect(mockedTwitchClient.init).not.toBeCalled();
  });
});
