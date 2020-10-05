import path from "path";
import sqlite3 from "sqlite3";
import Logger from "../utils/logger/Logger";

if (!process.env.DATABASE_FILE) {
  console.error("DATABASE_FILE not defined in .env using :memory:"); // eslint-disable-line no-console
}

const db = new sqlite3.Database(
  process.env.DATABASE_FILE
    ? path.join(process.cwd(), "db", process.env.DATABASE_FILE)
    : ":memory:"
);
db.run(`CREATE TABLE IF NOT EXISTS channels (
  channel TEXT UNIQUE PRIMARY KEY NOT NULL,
  session TEXT NOT NULL,
  connected INTEGER DEFAULT 1
)`);

export function getInitialChannelListFromDB(): Promise<string[]> {
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
}

export function getSessionFromDB(channel: string): Promise<string> {
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
}

export function setSessionInDB(
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
}

export function setChannelConnectedInDB(channel: string): Promise<void> {
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
}

export function setChannelDisconnectedInDB(channel: string): Promise<void> {
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
