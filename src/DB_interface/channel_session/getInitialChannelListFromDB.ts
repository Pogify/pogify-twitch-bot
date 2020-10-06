import { Database } from "sqlite3";
import Logger from "../../utils/logger/Logger";

export default function makeGetInitialChannelListFromDB(db: Database) {
  return function getInitialChannelListFromDB(): Promise<string[]> {
    Logger.getLogger().debug("getting initial channel list");
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT channel FROM channels WHERE connected = 1;",
        undefined,
        (err: Error | null, res: { channel: string }[]) => {
          if (err) return reject(err);
          Logger.getLogger().debug(`got initial list: ${JSON.stringify(res)}`);
          return resolve(res.map((e) => e.channel));
        }
      );
    });
  };
}
