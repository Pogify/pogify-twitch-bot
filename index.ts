/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import "module-alias/register";
import Logger from "./src/utils/logger/Logger";
import Server from "./src/core/server";

const app = Server();
app.listen(process.env.PORT, () => {
  Logger.getLogger().info(`Server Started on ${process.env.PORT}`);
});
