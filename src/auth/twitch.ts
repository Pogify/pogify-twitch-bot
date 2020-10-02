import express from "express";
import axios from "axios";
import { Client } from "tmi.js";

const redirect_uri = "http://localhost:7000/auth/twitch/callback";

export default function app(client: Client) {
  const app = express();

  app.get("/", (_, res) => {
    const url = "https://id.twitch.tv/oauth2/authorize";

    const params = new URLSearchParams();
    params.set("client_id", process.env.TWITCH_CLIENT_ID!);
    params.set("redirect_uri", redirect_uri);
    params.set("response_type", "code");

    res.redirect("https://id.twitch.tv/oauth2/authorize?" + params.toString());
  });

  app.get("/refresh", async (req, res) => {
    try {
      let newToken = await axios.post(
        "/https://id.twitch.tv/oauth2/token",
        undefined,
        {
          params: {
            grant_type: "refresh_token",
            client_id: process.env.TWITCH_CLIENT_ID!,
            client_secret: process.env.TWITCH_CLIENT_SECRET!,
            redirect_uri,
          },
        }
      );
      res.send(newToken);
    } catch (e) {
      if (e.response) {
        res.status(e.response.code).send(e.response.data);
      } else {
        console.error(e);
        res.status(500).send(e.message);
      }
    }
  });

  app.get("/callback", async (req, res) => {
    const params = new URLSearchParams();
    params.set("client_id", process.env.TWITCH_CLIENT_ID!);
    params.set("client_secret", process.env.TWITCH_CLIENT_SECRET!);
    params.set("code", req.query.code as string);
    params.set("grant_type", "authorization_code");
    params.set("redirect_uri", redirect_uri);

    try {
      let authRes = await axios.post(
        "https://id.twitch.tv/oauth2/token?" + params.toString()
      );

      try {
        let userData = await axios.get("https://api.twitch.tv/helix/users", {
          headers: {
            authorization: "Bearer " + authRes.data.access_token,
            "client-id": process.env.TWITCH_CLIENT_ID,
          },
        });

        if (req.session) {
          console.log(authRes.data, userData.data);
          req.sessionOptions.maxAge = authRes.data.expires_in;
          req.session.twitchUser = userData.data.data[0];
        }
        res.redirect("/manage");
      } catch (error) {
        console.error(error);
      }
    } catch (e) {
      console.error(e);
      if (e.response) {
        res.send(e.response.data).status(e.response.status);
      } else {
        res.status(500).send(e.message);
      }
    }
  });
  return app;
}
