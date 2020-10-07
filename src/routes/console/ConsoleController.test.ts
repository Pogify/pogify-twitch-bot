import ConsoleController from "./ConsoleController";

let consoleController = new ConsoleController();

const req: any = {};
const res: any = {};
res.render = jest.fn().mockReturnValue(res);
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);

let failSpy = jest.spyOn(consoleController, "fail");

beforeEach(() => {
  jest.clearAllMocks();
  consoleController = new ConsoleController();
  failSpy = jest.spyOn(consoleController, "fail");
});

test("test normal", async () => {
  await consoleController.execute(req, res);
  expect(res.render).toBeCalled();
  expect(failSpy).not.toBeCalled();
});

test("test error catch", async () => {
  res.render.mockImplementation(() => {
    throw new Error("bleh");
  });
  await consoleController.execute(req, res);

  expect(res.render).toBeCalled();
  expect(failSpy).toBeCalled();
});
