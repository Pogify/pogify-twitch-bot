import initializeRouter from ".";

jest.autoMockOn();

test("test routes", async () => {
  expect(initializeRouter.stack).toMatchSnapshot();
});
