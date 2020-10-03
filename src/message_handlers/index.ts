import { ChatUserstate, Client } from "tmi.js";
import { getSessionFromDB, setChannelDisconnectedInDB } from "../DB_interface";
import { setSession } from "./set";

export type BroadcasterCommands =
  | "ok"
  | "set"
  | "create"
  | "disconnect"
  | "ping";

export interface handleBroadcasterCommandContext {
  client: Client;
  channel: string;
  userstate: ChatUserstate;
  cmd: BroadcasterCommands;
  args: string[];
}

export async function handleBroadcasterCommands(
  context: handleBroadcasterCommandContext
) {
  const { channel, cmd, client } = context;
  switch (cmd) {
    case "ping":
      client.say(channel, "pong");
      return;
    case "set":
      setSession(context);
      return;
    case "create":
      client.say(channel, "https://www.pogify.net/create");
      return;
    case "disconnect":
      client.say(channel, "Pogify Bot disconnected");
      await setChannelDisconnectedInDB(channel);
      await client.part(channel);
      return;
  }
}

export async function saySessionForChannel(client: Client, channel: string) {
  let session = await getSessionFromDB(channel);

  if (session) {
    client.say(channel, "https://www.pogify.net/session/" + session);
  }
}

// not needed atm
// export function handleViewerCommands(
//   client: Client,
//   channel: string,
//   userstate: ChatUserstate,
//   cmd: string,
//   args: string[]
// ) {}
