import express, { Express } from "express";
jest.mock("express");
import { mocked } from "ts-jest/utils";
import CommonMiddleware from "./CommonMiddleware";

let commonMiddleware: CommonMiddleware;

let mockedExpress = mocked(express, true);
let mockedApp = mocked(express(), true);
mockedExpress.mockReturnValue(mockedApp);

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
