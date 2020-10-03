import tmi from "tmi.js";
import { env } from "process";
import express from "express";
import cors from "cors";
import jose from "jose";
import Axios from "axios";
import cookieParser from "cookie-parser";
// @ts-expect-error || no types
import whiskers from "whiskers";

import {
  BroadcasterCommands,
  handleBroadcasterCommands,
  saySessionForChannel,
  // handleViewerCommands,
} from "./message_handlers";
import {
  getInitialChannelListFromDB,
  getSessionFromDB as getSessionIdFromDB,
  removeChannelFromDB,
  setSession,
} from "./DB_interface";

require("dotenv").config();

async function init(token: string): Promise<tmi.Client> {
  return new Promise(async (resolve, reject) => {
    let initialChannels: string[];
    try {
      initialChannels = await getInitialChannelListFromDB();
    } catch (e) {
      return reject(e);
    }
    // Define configuration options
    const opts: tmi.Options = {
      connection: {
        secure: true,
      },
      options: { debug: true },
      identity: {
        username: "pogify_bot",
        // password: "oauth:" + token.access_token,
        password: "oauth:" + token,
      },
      channels: initialChannels,
    };
    // Create a client with our options
    // @ts-expect-error || something wrong with the types
    const client: tmi.Client = new tmi.client(opts);

    client.on("message", async (channel, userstate, message, self) => {
      if (self || !message.match(/^!pogify/i)) return;

      if (message.match(/^!pogify$/i)) {
        saySessionForChannel(client, channel);

        return;
      }

      const [_, cmd, ...args] = message.split(" ");
      if (userstate.badges?.broadcaster) {
        handleBroadcasterCommands({
          client,
          channel,
          userstate,
          cmd: cmd as BroadcasterCommands,
          args,
        });
      } else {
        // handleViewerCommands(client, channel, userstate, cmd as ViewerCommands, args);
      }
    });

    client.on("connected", () => {
      resolve(client);
    });

    client.connect().catch(reject);
  });
}

async function main() {
  var initialized = false;

  let client: tmi.Client;

  let twitchJWKS: jose.JWKS.KeyStore;
  try {
    let twitchJWKSObj = (await Axios.get("https://id.twitch.tv/oauth2/keys"))
      .data;
    twitchJWKS = jose.JWKS.asKeyStore(twitchJWKSObj);
  } catch (e) {
    console.error(e);
    return;
  }

  const app = express();
  app.set("trust proxy", 1);
  app.engine(".html", whiskers.__express);
  app.use("/public", express.static(process.cwd() + "/public"));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.set("views", process.cwd() + "/public");
  app.use(cors());

  app.get("/", (_, res) => {
    res.render("index.html", {
      client_id: process.env.TWITCH_CLIENT_ID,
      initialized,
    });
  });

  app.get("/init", (_, res) => {
    if (initialized) {
      res.status(200).send("chatbot already initialized");
    } else {
      res.render("init.html", { client_id: process.env.TWITCH_CLIENT_ID });
    }
  });

  app.get("/init/callback", async (req, res) => {
    if (initialized) return res.status(200).send("already initialized");
    const { state } = req.query;
    const { csrfState } = req.cookies;
    if (state && csrfState && state !== csrfState) {
      res.status(422).send(`Invalid state: ${csrfState} != ${state}`);
      return;
    }

    const params = new URLSearchParams();
    params.set("client_id", process.env.TWITCH_CLIENT_ID!);
    params.set("client_secret", process.env.TWITCH_CLIENT_SECRET!);
    params.set("code", req.query.code as string);
    params.set("grant_type", "authorization_code");
    params.set("redirect_uri", redirectUri(req.protocol, req.hostname));

    let tokenRes;
    try {
      tokenRes = await Axios.post(
        "https://id.twitch.tv/oauth2/token?" + params.toString()
      );
    } catch (e) {
      if (e.response) {
        res.send(e.response.data).status(e.response.status);
      } else {
        console.error(e);
        res.status(500).send(e.message);
      }
      return;
    }

    const token = tokenRes.data.access_token;

    let authUserRes;
    try {
      authUserRes = await Axios.get("https://api.twitch.tv/helix/users", {
        headers: {
          authorization: `Bearer ${token}`,
          "client-id": process.env.TWITCH_CLIENT_ID,
        },
      });
    } catch (e) {
      if (e.response) {
        res.status(e.response.status).send(e.response.data);
      } else {
        console.error(e);
        res.sendStatus(500);
      }
      return;
    }

    if (authUserRes.data.data[0].login !== process.env.BOT_USERNAME)
      return res.status(403).send("token not for bot");

    try {
      client = await init(token);
      initialized = true;
      res.status(200).send("chatbot initialized");
    } catch (e) {
      console.error(e);
      res.status(500).send(e.message);
      return;
    }
    return;
  });

  app.use("/", async (req, res, next) => {
    if (!initialized) {
      res.sendStatus(503);
      return;
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        let profileInfoRes = await Axios.get(
          "https://api.twitch.tv/helix/users",
          {
            headers: {
              authorization: `Bearer ${token}`,
              "client-id": process.env.TWITCH_CLIENT_ID,
            },
          }
        );

        req.twitch = profileInfoRes.data.data[0];
        next();
      } catch (e) {
        res.status(401).send(e.message);
      }
    } else {
      res.status(400).send("no authorization header");
    }
  });

  app.post("/join", async (req, res) => {
    try {
      await client.join(`#${req.twitch.login}`);
      res.status(200).send(req.twitch.login);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  app.post("/part", async (req, res) => {
    const channel = `#${req.twitch.login}`;
    try {
      await removeChannelFromDB(channel);
      await client.part(channel);
      res.status(200).send(req.twitch.login);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  app.post("/set", async (req, res) => {
    if (!req.query.sessionId) {
      return res.status(400).send("missing sessionId param");
    }

    if (!(req.query.sessionId as string).match(/^[a-z0-9]{5}$/i)) {
      return res.status(400).send("invalid sessionId");
    }

    try {
      await setSession(`#${req.twitch.login}`, req.query.sessionId as string);
      res.status(200).send(req.query.sessionId);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  app.get("/current", async (req, res) => {
    try {
      let sessionId = await getSessionIdFromDB(`#${req.twitch.login}`);
      if (sessionId) {
        res.status(200).send(sessionId);
      } else {
        res.status(404).send(`no session id set for #${req.twitch.login}`);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  app.listen(env.PORT, () => {
    console.log("listening on: " + env.PORT);
  });
}

main();

function redirectUri(proto: string, host: string) {
  if (host === "localhost") return `${proto}://localhost:${process.env.PORT}/`;

  return `${proto}://${host}/`;
}
