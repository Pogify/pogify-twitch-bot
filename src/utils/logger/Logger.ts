import winston from "winston";
import { options } from "../../../configs/LoggerConfig.json";

export default class Logger {
  private logger: winston.Logger;

  private static instance: Logger;

  private constructor() {
    if (process.env.NODE_ENV === "test") {
      this.logger = winston.createLogger({
        transports: [new winston.transports.Console(options.console)],
      });
    } else {
      this.logger = winston.createLogger({
        transports: [
          new winston.transports.Console(options.console),
          new winston.transports.File(options.file),
        ],
      });
    }
  }

  public static getLoggerInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public static getLogger(): winston.Logger {
    return Logger.getLoggerInstance().logger;
  }
}
