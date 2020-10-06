import { Database } from "sqlite3";
import Logger from "../../utils/logger/Logger";

export default function setSessionInDBFactory(db: Database) {
  return function setSessionInDB(
    channel: string,
    session: string
  ): Promise<void> {
    Logger.getLogger().debug(`setting ${channel} with id ${session}`);
    return new Promise<void>((resolve, reject) => {
      db.run(
        "INSERT INTO channels (channel, session) VALUES ($channel,$session) ON CONFLICT(channel) DO UPDATE SET session = $session, connected = 1;",
        {
          $channel: channel,
          $session: session,
        },
        (err) => {
          if (err) return reject(err);
          return resolve();
        }
      );
    });
  };
}
