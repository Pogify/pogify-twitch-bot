/* eslint no-async-promise-executor: "off" */
import { ChatUserstate, Client, Options } from "tmi.js";

import validateSessionID from "../../utils/ValidateSessionID";
import pogifyUrls from "../../constants/PogifyConstants.json";
import * as DBI from "../../DB_interface";
import { BroadcasterCommands, IHandleBroadcasterCommandArgs } from "./types";
import ClientNotInitialized from "./errors/ClientNotInitialized";

export default class TwitchClient {
  static client: Client | undefined;

  static refreshToken: string | undefined;

  public static async init(token: string): Promise<void> {
    // eslint-disable-next-line consistent-return
    return new Promise(async (resolve, reject) => {
      let initialChannels: string[];
      try {
        initialChannels = await DBI.getInitialChannelListFromDB();
      } catch (e) {
        return reject(e);
      }
      // Define configuration options
      const opts: Options = {
        connection: {
          secure: true,
        },
        options: { debug: true },
        identity: {
          username: "pogify_bot",
          // password: "oauth:" + token.access_token,
          password: `oauth:${token}`,
        },
        channels: initialChannels,
      };
      // Create a client with our options
      // @ts-expect-error || something wrong with the types
      const client: Client = new Client(opts);

      TwitchClient.BindHandlers(client);

      client.on("connected", () => {
        this.client = client;
        resolve();
      });

      client.connect().catch(reject);
    });
  }

  public static BindHandlers(client: Client): void {
    client.on("message", TwitchClient.handleMessage);
    client.on("disconnected", TwitchClient.handleDisconnect);
  }

  public static async handleMessage(
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean
  ): Promise<void> {
    if (self || !message.match(/^!pogify/i)) return;

    if (message.match(/^!pogify$/i)) {
      TwitchClient.saySessionForChannel(channel);

      return;
    }

    const [, cmd, ...args] = message.split(" ");
    if (userstate.badges?.broadcaster) {
      TwitchClient.handleBroadcasterCommands({
        channel,
        userstate,
        cmd: cmd as BroadcasterCommands,
        args,
      });
    } else {
      // handleViewerCommands(client, channel, userstate, cmd as ViewerCommands, args);
    }
  }

  public static async handleDisconnect(_reason: string): Promise<void> {
    // TODO: implement disconnect handler
  }

  public static async handleBroadcasterCommands(
    args: IHandleBroadcasterCommandArgs
  ): Promise<void> {
    if (!TwitchClient.client) throw new ClientNotInitialized();

    const { channel, cmd } = args;
    switch (cmd) {
      case "ping":
        TwitchClient.client.say(channel, "pong");
        return;
      case "set":
        TwitchClient.SetSession({
          channel: args.channel,
          sessionId: args.args[0],
        });
        return;
      case "create":
        TwitchClient.client.say(channel, pogifyUrls.create);
        return;
      case "disconnect":
        TwitchClient.PartFromChannel(args);
        break;
      default:
      // to keep linter happy
      // invalid commands should fail silently
    }
  }

  protected static async saySessionForChannel(channel: string): Promise<void> {
    if (!TwitchClient.client) throw new ClientNotInitialized();

    const session = await DBI.getSessionFromDB(channel);

    if (session) {
      TwitchClient.client.say(channel, `${pogifyUrls.session}/${session}`);
    }
  }

  public static async SetSession(args: {
    channel: string;
    sessionId: string;
  }): Promise<void> {
    if (!TwitchClient.client) throw new ClientNotInitialized();

    if (args.sessionId === "") {
      return;
    }
    if (validateSessionID(args.sessionId)) {
      await DBI.setSessionInDB(args.channel, args.sessionId);
      TwitchClient.client.say(
        args.channel,
        `Pogify: Set session ID to: ${args.sessionId}`
      );
    } else {
      TwitchClient.client.say(
        args.channel,
        `Pogify: ${args.sessionId} is not a valid session ID`
      );
    }
  }

  public static async JoinChannel(args: { channel: string }): Promise<void> {
    if (!TwitchClient.client) throw new ClientNotInitialized();
    const { channel } = args;

    await DBI.setChannelConnectedInDB(channel);
    await TwitchClient.client.join(channel);
  }

  public static async PartFromChannel(args: {
    channel: string;
  }): Promise<void> {
    if (!TwitchClient.client) throw new ClientNotInitialized();
    const { channel } = args;

    await DBI.setChannelDisconnectedInDB(channel);
    await TwitchClient.client.say(channel, "Pogify Bot disconnected");

    await TwitchClient.client.part(channel);
  }
}
