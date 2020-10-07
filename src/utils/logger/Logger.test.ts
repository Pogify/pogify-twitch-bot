// @ts-expect-error
import L from "winston/lib/winston/logger";
import Logger from "./Logger";

describe("test logger", () => {
  test("test static getLogger", () => {
    const logger = Logger;
    const loggerInstance = logger.getLoggerInstance();

    expect(loggerInstance).toBeInstanceOf(Logger);
  });

  test("test static getLoggerInstance", () => {
    const logger = Logger;
    const loggerInstanceLogger = logger.getLogger();
    expect(loggerInstanceLogger).toBeInstanceOf(L);
  });

  test("test constructor sets logger", () => {
    // @ts-expect-error
    const logger = new Logger();
    expect(logger.logger).toMatchSnapshot();
  });
});
