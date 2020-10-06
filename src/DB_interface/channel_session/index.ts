import path from "path";
import sqlite3 from "sqlite3";
import makeDeleteChannelFromDB from "./deleteChannelFromDB";
import makeGetInitialChannelListFromDB from "./getInitialChannelListFromDB";
import makeGetSessionFromDB from "./getSessionFromDB";
import makeSetChannelConnectedInDB from "./setChannelConnectedInDB";
import makeSetChannelDisconnectedInDb from "./setChannelDisconnectedInDB";
import makeGetSessionInDB from "./setSessionInDB";

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

export const getInitialChannelListFromDB = makeGetInitialChannelListFromDB(db);
export const getSessionFromDB = makeGetSessionFromDB(db);
export const setSessionInDB = makeGetSessionInDB(db);
export const setChannelConnectedInDB = makeSetChannelConnectedInDB(db);
export const setChannelDisconnectedInDB = makeSetChannelDisconnectedInDb(db);
export const deleteChannelFromDB = makeDeleteChannelFromDB(db);
