import sqlite3 from "sqlite3";

const db = new sqlite3.Database(process.cwd() + "/db/channels.db");
db.run(`CREATE TABLE IF NOT EXISTS channels (
  channel TEXT UNIQUE PRIMARY KEY NOT NULL,
  session TEXT NOT NULL,
  connected INTEGER DEFAULT 1
)`);

export async function getInitialChannelListFromDB(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT channel FROM channels WHERE connected = 1;",
      undefined,
      (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res.map((e: any) => e.channel));
      }
    );
  });
}

export async function getSessionFromDB(channel: string): Promise<string> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT session FROM channels WHERE channel like ? LIMIT 1",
      channel,
      (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res.session);
      }
    );
  });
}

export async function setSession(
  channel: string,
  session: string
): Promise<void> {
  new Promise<void>((resolve, reject) => {
    db.run(
      "INSERT INTO channels (channel, session) VALUES ($channel,$session) ON CONFLICT(channel) DO UPDATE SET session = $session, connected = 1;",
      {
        $channel: channel,
        $session: session,
      },
      (err: any, res: any) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

export function removeChannelFromDB(channel: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE channels SET connected = 0 WHERE channel like $channel",
      { $channel: channel },
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}
