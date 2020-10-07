import CsrfTokenIssueMiddleware from "./CsrfTokenIssueMiddleware";
import CsrfTokenConstants from "../../constants/CsrfTokenConstants.json";

let csrfTokenIssueMiddleware: CsrfTokenIssueMiddleware;
const mockReq = jest.fn() as any;
const res = {} as any;
const mockCookie = jest.fn().mockReturnValue(res);
const mockRes = () => {
  res.cookie = mockCookie;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn() as any;

beforeEach(() => {
  jest.clearAllMocks();
  csrfTokenIssueMiddleware = new CsrfTokenIssueMiddleware();
});

test("assign cookie", async () => {
  const uncaughtErrorSpy = jest.spyOn(
    csrfTokenIssueMiddleware,
    "uncaughtError"
  );
  await csrfTokenIssueMiddleware.execute(mockReq, mockRes(), mockNext);
  expect(mockCookie).toBeCalledWith(
    CsrfTokenConstants.cookieName,
    expect.any(String),
    { httpOnly: true, maxAge: 900000, secure: false, signed: true }
  );
  expect(mockNext).toBeCalled();
  expect(uncaughtErrorSpy).not.toBeCalled();
});

test("test error", async () => {
  const uncaughtErrorSpy = jest.spyOn(
    csrfTokenIssueMiddleware,
    "uncaughtError"
  );
  mockCookie.mockImplementation(() => {
    throw new Error();
  });

  await csrfTokenIssueMiddleware.execute(mockReq, mockRes(), mockNext);
  expect(mockCookie).toBeCalledWith(
    CsrfTokenConstants.cookieName,
    expect.any(String),
    { httpOnly: true, maxAge: 900000, secure: false, signed: true }
  );
  expect(mockNext).not.toBeCalled();
  expect(uncaughtErrorSpy).toBeCalled();
});
