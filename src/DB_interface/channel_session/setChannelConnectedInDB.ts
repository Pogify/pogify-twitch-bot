import { Database } from "sqlite3";

export default function makeSetChannelConnectedInDB(db: Database) {
  return function setChannelConnectedInDB(channel: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      db.run(
        "UPDATE channels SET connected = 1 WHERE channel like $channel",
        { $channel: channel },
        (err) => {
          if (err) return reject(err);
          return resolve();
        }
      );
    });
  };
}
