import { Database } from "sqlite3";

export default function MakeDeleteChannelFromDB(db: Database) {
  return function deleteChannelFromDB(channel: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      db.run(
        "DELETE FROM channels WHERE channel like $channel",
        { $channel: channel },
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  };
}
