import { Request, Response } from "express";
import { nanoid } from "nanoid";
import BaseHandler from "./BaseHandler";

class TestBaseHandler extends BaseHandler {
  async executeImpl(req: Request, res: Response) {}

  async execute(req: Request, res: Response): Promise<void> {}

  // public static jsonResponse = jest
  //   .fn()
  //   .mockImplementation(BaseHandler.jsonResponse);
}

type MockResponse = Response;

let testBaseHandler: TestBaseHandler;
let mockRes: MockResponse;
let jsonResponseSpy = jest.spyOn(BaseHandler, "jsonResponse");
const mockResponse = () => {
  const res = {} as MockResponse;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.type = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  testBaseHandler = new TestBaseHandler();

  mockRes = mockResponse();
});

afterEach(() => {
  jsonResponseSpy.mockClear();
});

describe("test ok", () => {
  test("test without dto", () => {
    let returnRes = testBaseHandler.ok(mockRes);

    expect(returnRes).toBe(mockRes);
    expect(mockRes.sendStatus).toBeCalled();
  });
  test("test with dto", () => {
    const mockDTO = { foo: "bar" };
    const type = "application/json";

    const returnRes = testBaseHandler.ok(mockRes, mockDTO);

    expect(returnRes).toBe(mockRes);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith(mockDTO);
    expect(mockRes.type).toBeCalledWith(type);
  });
});

test("test jsonReponse", () => {
  const args = {
    res: mockRes,
    code: 200,
    message: "this is a message",
  };

  let returnRes = TestBaseHandler.jsonResponse(
    args.res,
    args.code,
    args.message
  );

  expect(returnRes).toBe(mockRes);
  expect(mockRes.status).toBeCalledWith(args.code);
  expect(mockRes.json).toBeCalledWith({
    code: args.code,
    message: args.message,
  });
});

test("test created", () => {
  let returnRes = testBaseHandler.created(mockRes);

  expect(returnRes).toBe(returnRes);
  expect(returnRes.sendStatus).toBeCalledWith(201);
});

describe("test clientError", () => {
  const CLIENT_ERROR_CODE = 400;
  test("with message", () => {
    const testMessage = nanoid();
    let returnRes = testBaseHandler.clientError(mockRes, testMessage);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      CLIENT_ERROR_CODE,
      testMessage
    );
  });
  test("without message", () => {
    let returnRes = testBaseHandler.clientError(mockRes);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      CLIENT_ERROR_CODE,
      "Client Error"
    );
  });
});
describe("test unauthorized", () => {
  const unauthorized_CODE = 401;
  test("with message", () => {
    const testMessage = nanoid();
    let returnRes = testBaseHandler.unauthorized(mockRes, testMessage);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      unauthorized_CODE,
      testMessage
    );
  });
  test("without message", () => {
    let returnRes = testBaseHandler.unauthorized(mockRes);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      unauthorized_CODE,
      "Unauthorized"
    );
  });
});
describe("test paymentRequired", () => {
  const paymentRequired_CODE = 402;
  test("with message", () => {
    const testMessage = nanoid();
    let returnRes = testBaseHandler.paymentRequired(mockRes, testMessage);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      paymentRequired_CODE,
      testMessage
    );
  });
  test("without message", () => {
    let returnRes = testBaseHandler.paymentRequired(mockRes);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      paymentRequired_CODE,
      "Payment Required"
    );
  });
});
describe("test forbidden", () => {
  const forbidden_CODE = 403;
  test("with message", () => {
    const testMessage = nanoid();
    let returnRes = testBaseHandler.forbidden(mockRes, testMessage);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      forbidden_CODE,
      testMessage
    );
  });
  test("without message", () => {
    let returnRes = testBaseHandler.forbidden(mockRes);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      forbidden_CODE,
      "Forbidden"
    );
  });
});
describe("test notFound", () => {
  const notFound_CODE = 404;
  test("with message", () => {
    const testMessage = nanoid();
    let returnRes = testBaseHandler.notFound(mockRes, testMessage);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      notFound_CODE,
      testMessage
    );
  });
  test("without message", () => {
    let returnRes = testBaseHandler.notFound(mockRes);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      notFound_CODE,
      "Not Found"
    );
  });
});
describe("test conflict", () => {
  const conflict_CODE = 409;
  test("with message", () => {
    const testMessage = nanoid();
    let returnRes = testBaseHandler.conflict(mockRes, testMessage);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      conflict_CODE,
      testMessage
    );
  });
  test("without message", () => {
    let returnRes = testBaseHandler.conflict(mockRes);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      conflict_CODE,
      "Conflict"
    );
  });
});
describe("test tooMany", () => {
  const tooMany_CODE = 429;
  test("with message", () => {
    const testMessage = nanoid();
    let returnRes = testBaseHandler.tooMany(mockRes, testMessage);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      tooMany_CODE,
      testMessage
    );
  });
  test("without message", () => {
    let returnRes = testBaseHandler.tooMany(mockRes);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      tooMany_CODE,
      "Too Many Requests"
    );
  });
});
test("test todo", () => {
  const todo_CODE = 400;
  let returnRes = testBaseHandler.todo(mockRes);

  expect(returnRes).toBe(returnRes);
  expect(TestBaseHandler.jsonResponse).toBeCalledWith(
    mockRes,
    todo_CODE,
    "TODO"
  );
});

describe("test fail", () => {
  const fail_CODE = 500;
  test("with message", () => {
    const testMessage = nanoid();
    let returnRes = testBaseHandler.fail(mockRes, testMessage);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      fail_CODE,
      testMessage
    );
  });
  test("with error", () => {
    const testMessage = nanoid();
    const testErr = new Error(testMessage);
    const returnRes = testBaseHandler.fail(mockRes, testMessage);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      fail_CODE,
      testMessage
    );
  });
  test("without error or message", () => {
    const returnRes = testBaseHandler.fail(mockRes);

    expect(returnRes).toBe(returnRes);
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      fail_CODE,
      "An Error Occurred"
    );
  });
});

describe("test uncaughtError", () => {
  const code = 500;
  describe("with error", () => {
    test("with message", () => {
      const testMessage = nanoid();
      const testError = new Error(nanoid());
      let returnRes = testBaseHandler.uncaughtError(
        mockRes,
        testError,
        testMessage
      );

      expect(returnRes).toBeUndefined();
    });

    test("without message", () => {
      const testMessage = nanoid();
      const testError = new Error(nanoid());
      let returnRes = testBaseHandler.uncaughtError(mockRes, testError);

      expect(returnRes).toBeUndefined();
      expect(TestBaseHandler.jsonResponse).toBeCalledWith(
        mockRes,
        code,
        "An Error Occurred"
      );
    });
  });

  test("without error", () => {
    const testMessage = nanoid();
    let returnRes = testBaseHandler.uncaughtError(mockRes, testMessage);

    expect(returnRes).toBeUndefined();
    expect(TestBaseHandler.jsonResponse).toBeCalledWith(
      mockRes,
      code,
      testMessage
    );
  });
});
