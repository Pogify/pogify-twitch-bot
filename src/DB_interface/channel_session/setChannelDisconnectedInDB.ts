import { Database } from "sqlite3";

export default function makeSetChannelDisconnectedInDb(db: Database) {
  return function setChannelDisconnectedInDB(channel: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE channels SET connected = 0 WHERE channel like $channel",
        { $channel: channel },
        (err) => {
          if (err) return reject(err);
          return resolve();
        }
      );
    });
  };
}
