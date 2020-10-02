import tmi from "tmi.js";
import { env } from "process";
import express from "express";
import cors from "cors";
import jose from "jose";
import Axios from "axios";

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
import twitchAuth from "./auth/twitch";

require("dotenv").config();

async function init(): Promise<tmi.Client> {
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
        password: "oauth:" + env.TWITCH_ACCESS_TOKEN,
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
  let client: tmi.Client;
  try {
    client = await init();
  } catch (e) {
    console.error(e);
    return;
  }

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

  app.use(cors());
  app.use(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        // @ts-expect-error || type error with multiple aud.
        let jwk = jose.JWT.verify(token, twitchJWKS, {
          audience: [env.POGIFY_TWITCH_CLIENT_ID, env.TWITCH_CLIENT_ID],
          issuer: "https://id.twitch.tv/oauth2",
        });
        req.twitch = {
          // @ts-expect-error || jwk type doesn't have claims
          username: jwk.preferred_username,
        };
        console.log(jwk);
        next();
      } catch (e) {
        res.status(401).send(e.message);
      }
    } else {
      res.sendStatus(401);
    }
  });

  app.use("/auth/twitch", twitchAuth(client));

  app.post("/join", async (req, res) => {
    try {
      await client.join(`#${req.twitch.username}`);
      res.sendStatus(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  app.post("/part", async (req, res) => {
    const channel = `#${req.twitch.username}`;
    try {
      await removeChannelFromDB(channel);
      await client.part(channel);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  app.post("/set", async (req, res) => {
    if (!req.params.sessionId) {
      return res.status(400).send("missing sessionId param");
    }

    try {
      await setSession(`#${req.twitch.username}`, req.params.sessionId);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  app.get("/current", async (req, res) => {
    try {
      let sessionId = await getSessionIdFromDB(`#${req.twitch.username}`);
      if (sessionId) {
        res.status(200).send(sessionId);
      } else {
        res.status(404).send(`no session id set for #${req.twitch.username}`);
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
