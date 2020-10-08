import { Request } from "express";
import { nanoid } from "nanoid";
import CsrfTokenVerifyMiddleware from "./CsrfTokenVerifyMiddleware";
import CsrfTokenConstants from "../../constants/CsrfTokenConstants.json";

let csrfTokenVerifyMiddleware = new CsrfTokenVerifyMiddleware();
let state1: string;

beforeEach(() => {
  csrfTokenVerifyMiddleware = new CsrfTokenVerifyMiddleware();
  state1 = nanoid();
});

test("test verify", () => {
  const failSpy = jest.spyOn(csrfTokenVerifyMiddleware, "fail");
  const req = ({
    query: {
      state: state1,
    },
    signedCookies: {
      [CsrfTokenConstants.cookieName]: state1,
    },
  } as unknown) as Request;
  const res: any = {};
  const next: any = jest.fn();
  csrfTokenVerifyMiddleware.execute(req, res, next);

  expect(next).toBeCalled();
  expect(failSpy).not.toBeCalled();
});
test("test mismatch", () => {
  const state2 = nanoid();

  const failSpy = jest.spyOn(csrfTokenVerifyMiddleware, "fail");
  const req = ({
    query: {
      state: state1,
    },
    signedCookies: {
      [CsrfTokenConstants.cookieName]: state2,
    },
  } as unknown) as Request;
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  const next: any = jest.fn();
  csrfTokenVerifyMiddleware.execute(req, res, next);

  expect(next).not.toBeCalled();
  expect(res.status).toBeCalledWith(422);
  expect(res.send).toBeCalled();
  expect(failSpy).not.toBeCalled();
});

describe("test missing", () => {
  test("no query", () => {
    const failSpy = jest.spyOn(csrfTokenVerifyMiddleware, "fail");
    const req = ({
      query: {},
      signedCookies: {
        [CsrfTokenConstants.cookieName]: state1,
      },
    } as unknown) as Request;
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    const next: any = jest.fn();
    csrfTokenVerifyMiddleware.execute(req, res, next);

    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(422);
    expect(res.send).toBeCalled();
    expect(failSpy).not.toBeCalled();
  });
  test("no cookie", () => {
    const failSpy = jest.spyOn(csrfTokenVerifyMiddleware, "fail");
    const req = ({
      query: {
        state: state1,
      },
      signedCookies: {},
    } as unknown) as Request;
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    const next: any = jest.fn();
    csrfTokenVerifyMiddleware.execute(req, res, next);

    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(422);
    expect(res.send).toBeCalled();
    expect(failSpy).not.toBeCalled();
  });
  test("no both", () => {
    const failSpy = jest.spyOn(csrfTokenVerifyMiddleware, "fail");
    const req = ({
      query: {},
      signedCookies: {},
    } as unknown) as Request;
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    const next: any = jest.fn();
    csrfTokenVerifyMiddleware.execute(req, res, next);

    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(422);
    expect(res.send).toBeCalled();
    expect(failSpy).not.toBeCalled();
  });
});
