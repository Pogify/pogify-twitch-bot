import botControlRouter from ".";

jest.autoMockOn();

test("test routes", async () => {
  expect(botControlRouter.stack).toMatchSnapshot();
});
