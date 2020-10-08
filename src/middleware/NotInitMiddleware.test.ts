jest.mock("../service_classes/twitch_client/TwitchClient");

import { mocked } from "ts-jest/utils";
import TwitchClient from "../service_classes/twitch_client/TwitchClient";
import NotInitMiddleware from "./NotInitMiddleware";

let notInitMiddleware = new NotInitMiddleware();
let nextSpy = jest.spyOn(notInitMiddleware, "next");

beforeEach(() => {
  notInitMiddleware = new NotInitMiddleware();
  nextSpy = jest.spyOn(notInitMiddleware, "next");
});

const mockedTwitchClient = mocked(TwitchClient, true);

const req: any = {};
const res: any = {};
res.status = jest.fn().mockReturnValue(res);
res.type = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);
res.send = jest.fn();

const next: any = jest.fn();

test("test initialized true in middleware", async () => {
  mockedTwitchClient.client = undefined;
  notInitMiddleware.initialized = true;
  await notInitMiddleware.execute(req, res, next);
  expect(nextSpy).toBeCalled();
});

test("test no init", async () => {
  mockedTwitchClient.client = undefined;
  await notInitMiddleware.execute(req, res, next);
  expect(nextSpy).not.toBeCalled();
  expect(res.status).toBeCalledWith(503);
  expect(res.send).toBeCalled();
});

test("test client init but not initialized in middleware", async () => {
  // @ts-expect-error manually set not falsy value
  mockedTwitchClient.client = "not false";
  await notInitMiddleware.execute(req, res, next);
  expect(nextSpy).toBeCalled();
});

test("test use init property on second call after initialized", async () => {
  // @ts-expect-error manually set not falsy value
  mockedTwitchClient.client = "not false";
  await notInitMiddleware.execute(req, res, next);
  expect(nextSpy).toBeCalled();

  nextSpy.mockClear();
  // manually set falsey value
  mockedTwitchClient.client = undefined;
  await notInitMiddleware.execute(req, res, next);
  expect(nextSpy).toBeCalled();
});
