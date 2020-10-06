import { Database } from "sqlite3";
import Logger from "../../utils/logger/Logger";

export default function makeGetSessionFromDB(db: Database) {
  return function getSessionFromDB(channel: string): Promise<string> {
    Logger.getLogger().debug(`getting session for ${channel}`);
    return new Promise<string>((resolve, reject) => {
      db.get(
        "SELECT session FROM channels WHERE channel like ? LIMIT 1",
        channel,
        (err, res) => {
          if (err) return reject(err);
          if (res) {
            return resolve(res.session);
          }
          return resolve("");
        }
      );
    });
  };
}
