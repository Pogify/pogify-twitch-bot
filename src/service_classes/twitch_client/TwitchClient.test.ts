import pogifyUrls from "../../constants/PogifyConstants.json";

import { mocked } from "ts-jest/utils";
import tmi from "tmi.js";
jest.mock("tmi.js");
import * as DBI from "../../DB_interface/channel_session";
jest.mock("../../DB_interface/channel_session");

import TwitchClient from "./TwitchClient";
import { EventEmitter } from "events";
import { nanoid } from "nanoid";

const mockConnect = jest.fn();
const mockOnce = jest.fn();
const mockOn = jest.fn();
const mockSay = jest.fn();
const mockPart = jest.fn();
const mockJoin = jest.fn();
class MockClient extends EventEmitter {
  constructor(public options?: tmi.Options) {
    super();
  }
  connect = mockConnect.mockResolvedValue({});
  once = mockOnce.mockImplementation((_: any, cb: Function) => {
    setImmediate(() => {
      cb();
    });
    return this;
  });
  on = mockOn;
  say = mockSay;
  part = mockPart;
  join = mockJoin;
}

const mockedTMI = mocked(tmi, true);
mockedTMI.Client.mockImplementation((options) => {
  return (new MockClient(options) as unknown) as tmi.Client;
});

const mockedDBI = mocked(DBI, true);
mockedDBI.getInitialChannelListFromDB.mockResolvedValue([]);
let testChannel: string;
beforeEach(() => {
  testChannel = "#" + nanoid();
  TwitchClient.client = (new MockClient() as unknown) as tmi.Client;
  jest.clearAllMocks();
});

test("test init", (done) => {
  TwitchClient.client = undefined;
  const spyBinding = jest.spyOn(TwitchClient, "BindEventHandlers");
  TwitchClient.init("token").then(() => {
    expect(TwitchClient.client).toBeInstanceOf(MockClient);
    expect(spyBinding.mock.calls[0][0]).toBeInstanceOf(MockClient);
    done();
  });
});

test("test initClient", async () => {
  let client = ((await TwitchClient.initClient(
    "token"
  )) as unknown) as MockClient;
  expect(client.options).toStrictEqual(
    // @ts-expect-error
    TwitchClient.OptionsFactory("token", [])
  );
  expect(client).toBeInstanceOf(MockClient);
});

test("test binding", () => {
  let client = (new MockClient() as unknown) as tmi.Client;
  TwitchClient.BindEventHandlers(client);

  expect(mockOn).toBeCalledWith("message", expect.any(Function));
  expect(mockOn).toBeCalledWith("disconnected", expect.any(Function));
});

describe("test handleMessage", () => {
  test("test self", () => {
    TwitchClient.handleMessage("channel", {}, "message", true);
    expect(TwitchClient.client!.say).not.toBeCalled();
  });
  test("test not a !pogify prefix", () => {
    TwitchClient.handleMessage("channel", {}, nanoid(), false);
    expect(TwitchClient.client!.say).not.toBeCalled();
  });
  test("test !pogify not in beginning", () => {
    TwitchClient.handleMessage(
      "channel",
      {},
      nanoid() + "!pogify" + nanoid(10),
      false
    );
    expect(TwitchClient.client!.say).not.toBeCalled();
  });

  test("test broadcaster and command", () => {
    const spyHandleBroadcasterCommands = jest.spyOn(
      TwitchClient,
      "handleBroadcasterCommands"
    );
    TwitchClient.handleMessage(
      testChannel,
      { badges: { broadcaster: "1" } },
      "!pogify a",
      false
    );
    expect(spyHandleBroadcasterCommands).toBeCalled();

    // test command but no badges
    spyHandleBroadcasterCommands.mockClear();
    TwitchClient.handleMessage(testChannel, {}, "!pogify a", false);
    expect(spyHandleBroadcasterCommands).not.toBeCalled();
  });
  test("test !pogify prefix but no args", () => {
    const spySaySessionForChannel = jest.spyOn(
      TwitchClient,
      "SaySessionForChannel"
    );
    TwitchClient.handleMessage(
      testChannel,
      { badges: { broadcaster: "1" } },
      "!pogify",
      false
    );
    expect(spySaySessionForChannel).toBeCalledWith(testChannel);
  });
});

test.todo("test disconnect handler");

describe("test handleBroadCasterCommands", () => {
  test("test ping", () => {
    TwitchClient.handleBroadcasterCommands({
      args: [],
      channel: testChannel,
      cmd: "ping",
      userstate: {},
    });
    expect(TwitchClient.client!.say).toBeCalledWith(testChannel, "pong");
  });
  test("test set", () => {
    const spySetSession = jest.spyOn(TwitchClient, "SetSession");

    let testSessionId = nanoid(5);
    TwitchClient.handleBroadcasterCommands({
      args: [testSessionId, "edf"],
      channel: testChannel,
      cmd: "set",
      userstate: {},
    });
    expect(spySetSession).toBeCalledWith({
      channel: testChannel,
      sessionId: testSessionId,
    });
  });
  test("test create", () => {
    TwitchClient.handleBroadcasterCommands({
      args: [],
      channel: testChannel,
      cmd: "create",
      userstate: {},
    });
    expect(TwitchClient.client!.say).toBeCalledWith(
      testChannel,
      pogifyUrls.create
    );
  });

  test("test disconnect", () => {
    const spyPartFromChannel = jest.spyOn(TwitchClient, "PartFromChannel");
    TwitchClient.handleBroadcasterCommands({
      args: [],
      channel: testChannel,
      cmd: "disconnect",
      userstate: {},
    });

    expect(spyPartFromChannel.mock.calls[0][0]).toHaveProperty(
      "channel",
      testChannel
    );
  });

  test("not a command", () => {
    // no errors fail silently
    TwitchClient.handleBroadcasterCommands({
      args: [],
      channel: testChannel,
      // @ts-expect-error
      cmd: nanoid(),
      userstate: {},
    });
  });
});

describe("test SaySessionForChannel", () => {
  test("test session found", async () => {
    const testSessionId = nanoid();
    mockedDBI.getSessionFromDB.mockResolvedValueOnce(testSessionId);
    await TwitchClient.SaySessionForChannel(testChannel);

    expect(mockSay).toBeCalledWith(
      testChannel,
      `${pogifyUrls.session}/${testSessionId}`
    );
  });
  test("test session not found", async () => {
    mockedDBI.getSessionFromDB.mockResolvedValueOnce("");
    await TwitchClient.SaySessionForChannel(testChannel);

    expect(mockSay).not.toBeCalled();
  });
});

describe("test SetSession", () => {
  let testSession: string;
  beforeEach(() => {
    testSession = nanoid(5);
  });
  test("test empty", async () => {
    testSession = "";
    await TwitchClient.SetSession({
      channel: testChannel,
      sessionId: testSession,
    });
    expect(mockedDBI.setSessionInDB).not.toBeCalled();
    expect(mockSay).not.toBeCalled();
  });
  test("test valid", async () => {
    await TwitchClient.SetSession({
      channel: testChannel,
      sessionId: testSession,
    });
    expect(mockedDBI.setSessionInDB).toBeCalled();
    expect(mockSay.mock.calls[0][0]).toBe(testChannel);
    expect(mockSay.mock.calls[0][1]).toMatch(/set session id to:/i);
  });
  test("test invalid", async () => {
    testSession += nanoid(1);
    await TwitchClient.SetSession({
      channel: testChannel,
      sessionId: testSession,
    });
    expect(mockedDBI.setSessionInDB).not.toBeCalled();
    expect(mockSay.mock.calls[0][0]).toBe(testChannel);
    expect(mockSay.mock.calls[0][1]).toMatch(/is not a valid session id/i);
  });
});

describe("test JoinChannel", () => {
  test("test join success", async () => {
    await TwitchClient.JoinChannel({ channel: testChannel });
    expect(mockJoin).toBeCalledWith(testChannel);
    expect(mockedDBI.setChannelConnectedInDB).toBeCalledWith(testChannel);
  });
  test("test join fail", (done) => {
    mockJoin.mockRejectedValueOnce(undefined);
    TwitchClient.JoinChannel({ channel: testChannel }).catch(() => {
      expect(mockedDBI.setChannelConnectedInDB).not.toBeCalled();
      done();
    });
  });
});

test("test PartFromChannel", async () => {
  process.env.BOT_USERNAME = nanoid();
  await TwitchClient.PartFromChannel({ channel: testChannel });
  expect(mockedDBI.setChannelDisconnectedInDB).toBeCalledWith(testChannel);
  expect(mockSay).toBeCalledWith(
    testChannel,
    `${process.env.BOT_USERNAME} disconnected`
  );
  expect(mockPart).toBeCalledWith(testChannel);
});

describe("test no client throw error", () => {
  beforeEach(() => {
    TwitchClient.client = undefined;
  });

  test("handleBroadCasterCommands", (done) => {
    TwitchClient.handleBroadcasterCommands({
      args: [],
      channel: testChannel,
      cmd: "create",
      userstate: {},
    }).catch((err) => {
      expect(err).toBeTruthy();
      done();
    });
  });
  test("SaySessionForChannel", (done) => {
    TwitchClient.SaySessionForChannel(testChannel).catch((err) => {
      expect(err).toBeTruthy();
      done();
    });
  });
  test("SetSession", (done) => {
    TwitchClient.SetSession({
      channel: testChannel,
      sessionId: nanoid(),
    }).catch((err) => {
      expect(err).toBeTruthy();
      done();
    });
  });
  test("JoinChannel", (done) => {
    TwitchClient.JoinChannel({
      channel: testChannel,
    }).catch((err) => {
      expect(err).toBeTruthy();
      done();
    });
  });
  test("PartFromChannel", (done) => {
    TwitchClient.PartFromChannel({
      channel: testChannel,
    }).catch((err) => {
      expect(err).toBeTruthy();
      done();
    });
  });
});
