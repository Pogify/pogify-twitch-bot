import { Express } from "express";
import CommonMiddleware from "./CommonMiddleware";

jest.mock("express");

let commonMiddleware: CommonMiddleware;

const app = {
  use: jest.fn(),
  listen: jest.fn(),
};
jest.doMock("express", () => {
  return () => {
    return app;
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  commonMiddleware = new CommonMiddleware((app as unknown) as Express);
});

test("bind cors", () => {
  commonMiddleware.useCors();
  expect(app.use).toBeCalled();
});
test("bind Static folder", () => {
  commonMiddleware.useStaticFolder();
  expect(app.use).toBeCalled();
});
test("bind cookie parser", () => {
  commonMiddleware.useCookieParser();
  expect(app.use).toBeCalled();
});
