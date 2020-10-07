import { NextFunction, Request, Response } from "express";
import BaseMiddleware from "./BaseMiddleware";

class TestBaseMiddleware extends BaseMiddleware {
  executeImpl = jest.fn();
}

let testBaseHandler: TestBaseMiddleware;
beforeEach(() => {
  jest.clearAllMocks();
  testBaseHandler = new TestBaseMiddleware();
});

describe("test execute", () => {
  test("test normal", async () => {
    const spyImpl = jest.spyOn(testBaseHandler, "executeImpl");
    const spyUncaughtError = jest.spyOn(testBaseHandler, "uncaughtError");
    const anyFn: any = jest.fn();
    await testBaseHandler.execute(anyFn, anyFn, anyFn);
    expect(spyImpl).toBeCalled();
    expect(spyUncaughtError).not.toBeCalled();
  });

  test("test error", async () => {
    const spyImpl = jest.spyOn(testBaseHandler, "executeImpl");
    const spyUncaughtError = jest.spyOn(testBaseHandler, "uncaughtError");
    testBaseHandler.executeImpl.mockRejectedValue({});
    const res = jest.fn();
    const mockFn = () => {
      const res: any = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.type = jest.fn().mockReturnValue(res);
      res.sendStatus = jest.fn().mockReturnValue(res);
      return res;
    };

    await testBaseHandler.execute(mockFn(), mockFn(), mockFn());
    expect(spyImpl).toBeCalled();
    expect(spyUncaughtError).toBeCalled();
  });
});

test("test next", () => {
  const next = jest.fn();
  testBaseHandler.next(next);
  expect(next).toBeCalled();
});
