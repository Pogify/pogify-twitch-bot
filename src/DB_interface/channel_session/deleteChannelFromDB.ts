import { Database } from "sqlite3";

export default function makeDeleteChannelFromDB(db: Database) {
  return function deleteChannelFromDB(channel: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      db.run(
        "DELETE FROM channels WHERE channel = $channel",
        { $channel: channel },
        (err) => {
          if (err) return reject(err);
          return resolve();
        }
      );
    });
  };
}
