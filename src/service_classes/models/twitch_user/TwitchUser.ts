/* eslint camelcase: off */
import Axios from "axios";
import TwitchConstants from "../../../constants/TwitchConstants.json";

export interface IFetchUserArgs {
  token: string;
}

type BroadcasterType = "partner" | "affiliate" | "";
type type = "staff" | "admin" | "global_mod" | "";

export type TTwitchUser = {
  broadcaster_type: BroadcasterType;
  description: string;
  display_name: string;
  email?: string;
  id: string;
  login: string;
  offline_image_url: string;
  profile_image_url: string;
  type: type;
  view_count: number;
  created_at: string;
};

export class TwitchUser {
  public static async FetchUser(args: IFetchUserArgs): Promise<TTwitchUser> {
    const { token } = args;

    const res = await Axios.get(TwitchConstants.users, {
      headers: {
        authorization: `Bearer ${token}`,
        "client-id": process.env.TWITCH_CLIENT_ID,
      },
    });
    return res.data.data[0] as TTwitchUser;
  }
}
