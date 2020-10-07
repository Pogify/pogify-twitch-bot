import BaseController from "./BaseController";

const executeImplMock = jest.fn();

class TestBaseController extends BaseController {
  protected executeImpl = executeImplMock;
}

let testBaseController: TestBaseController;
const req: any = {};
const res: any = {};
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);

beforeEach(() => {
  testBaseController = new TestBaseController();
});

test("test normal", async () => {
  await testBaseController.execute(req, res);
  expect(executeImplMock).toBeCalled();
});

test("test uncaught error", async () => {
  const uncaughtErrorSpy = jest.spyOn(testBaseController, "uncaughtError");
  executeImplMock.mockImplementation(() => {
    throw new Error();
  });

  await testBaseController.execute(req, res);
  expect(executeImplMock).toBeCalled();
  expect(uncaughtErrorSpy).toBeCalled();
});
