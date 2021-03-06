export type BroadcasterCommands = "set" | "create" | "disconnect" | "ping";

export interface IHandleBroadcasterCommandArgs {
  channel: string;
  userstate: ChatUserstate;
  cmd: BroadcasterCommands;
  args: string[];
}
