import { handleBroadcasterCommandContext } from ".";
import * as DBI from "../DB_interface";

export async function setSession(context: handleBroadcasterCommandContext) {
  if (context.args[0] === "") {
    return;
  }
  if (context.args[0].match(/^[a-zA-z0-9]{5}$/i)) {
    await DBI.setSession(context.channel, context.args[0]);
    context.client.say(
      context.channel,
      `Pogify: Set session ID to: ${context.args[0]}`
    );
  } else {
    context.client.say(
      context.channel,
      `Pogify: ${context.args[0]} is not a valid session ID`
    );
  }
}
