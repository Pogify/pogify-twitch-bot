import { mocked } from "ts-jest/utils";
import TwitchUserMiddleware from "./TwitchUserMiddleware";
import { TwitchUser } from "../../service_classes/models/twitch_user/TwitchUser";
import ExtractAuthorizationToken, {
  AuthorizationValidationError,
} from "../../utils/ValidateAuthorizationHeader";

jest.mock("../../service_classes/models/twitch_user/TwitchUser");
jest.mock("../../utils/ValidateAuthorizationHeader");

let twitchUserMiddleware: TwitchUserMiddleware;
const mockedTwitchUser = mocked(TwitchUser, true);
const mockedExtractAuthorizationToken = mocked(ExtractAuthorizationToken, true);
let req: any = {
  headers: {
    authorization: "Bearer abc",
  },
};
const res = {} as any;
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);
const next: any = jest.fn();

beforeEach(() => {
  twitchUserMiddleware = new TwitchUserMiddleware();
  jest.clearAllMocks();
  req = {
    headers: {
      authorization: "Bearer abc",
    },
  };
});

test("test normal", async () => {
  const failSpy = jest.spyOn(twitchUserMiddleware, "fail");

  mockedTwitchUser.FetchUser.mockReturnValue({} as any);
  // @ts-ignore
  mockedExtractAuthorizationToken.mockResolvedValue({} as any);
  await twitchUserMiddleware.execute(req, res, next);
  expect(next).toBeCalled();
  expect(failSpy).not.toBeCalled();
});

test("no header", async () => {
  const failSpy = jest.spyOn(twitchUserMiddleware, "fail");
  const clientErrorSpy = jest.spyOn(twitchUserMiddleware, "clientError");
  req = {
    headers: {},
  };
  mockedTwitchUser.FetchUser.mockReturnValue({} as any);
  // @ts-ignore
  mockedExtractAuthorizationToken.mockResolvedValue({} as any);
  await twitchUserMiddleware.execute(req, res, next);

  expect(next).not.toBeCalled();
  expect(clientErrorSpy).toBeCalled();
  expect(failSpy).not.toBeCalled();
});

test("invalid header", async () => {
  const failSpy = jest.spyOn(twitchUserMiddleware, "fail");
  const clientErrorSpy = jest.spyOn(twitchUserMiddleware, "clientError");

  req = {
    headers: {
      authorization: "asldfjaklsdjf",
    },
  };
  mockedTwitchUser.FetchUser.mockReturnValue({} as any);
  // @ts-ignore
  mockedExtractAuthorizationToken.mockImplementationOnce(() => {
    throw new AuthorizationValidationError();
  });
  await twitchUserMiddleware.execute(req, res, next);

  expect(next).not.toBeCalled();
  expect(clientErrorSpy).toBeCalled();

  expect(failSpy).not.toBeCalled();
});
