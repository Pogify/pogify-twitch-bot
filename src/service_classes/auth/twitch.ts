/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Axios from "axios";
import TwitchConstants from "../../constants/TwitchConstants.json";

export interface IFetchTokenArgs {
  code: string;
  redirectUri: string;
}

export async function FetchToken(args: IFetchTokenArgs): Promise<string> {
  const { code, redirectUri } = args;

  const params = new URLSearchParams();
  params.set("client_id", process.env.TWITCH_CLIENT_ID!);
  params.set("client_secret", process.env.TWITCH_CLIENT_SECRET!);
  params.set("code", code as string);
  params.set("grant_type", "authorization_code");
  params.set("redirect_uri", redirectUri);
  const res = await Axios.post(`${TwitchConstants.token}?${params.toString()}`);
  return res.data.access_token;
}
