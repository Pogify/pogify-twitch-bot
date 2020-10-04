/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import "module-alias/register";
import Server from "./src/core/server";

Server();
