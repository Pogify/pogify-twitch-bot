import path from "path";
import sqlite3 from "sqlite3";

require("dotenv").config();
if (!process.env.DATABASE_FILE) {
  console.error("DATABASE_FILE not defined in .env");
  process.exit(1);
}

const db = new sqlite3.Database(
  path.join(process.cwd(), "db", process.env.DATABASE_FILE)
);
db.run(`CREATE TABLE IF NOT EXISTS channels (
  channel TEXT UNIQUE PRIMARY KEY NOT NULL,
  session TEXT NOT NULL,
  connected INTEGER DEFAULT 1
)`);

export function getInitialChannelListFromDB(): Promise<string[]> {
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

export function getSessionFromDB(channel: string): Promise<string> {
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

export function setSessionInDB(
  channel: string,
  session: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.run(
      "INSERT INTO channels (channel, session) VALUES ($channel,$session) ON CONFLICT(channel) DO UPDATE SET session = $session, connected = 1;",
      {
        $channel: channel,
        $session: session,
      },
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

export function setChannelConnectedInDB(channel: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.run(
      "UPDATE channels SET connected = 1 WHERE channel like $channel",
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

export function setChannelDisconnectedInDB(channel: string): Promise<void> {
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

export function deleteChannelFromDB(channel: string): Promise<void> {
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
}
