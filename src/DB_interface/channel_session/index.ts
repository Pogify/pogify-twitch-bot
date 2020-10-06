import DBConnection from "../DBConnection";
import makeDeleteChannelFromDB from "./deleteChannelFromDB";
import makeGetInitialChannelListFromDB from "./getInitialChannelListFromDB";
import makeGetSessionFromDB from "./getSessionFromDB";
import makeSetChannelConnectedInDB from "./setChannelConnectedInDB";
import makeSetChannelDisconnectedInDb from "./setChannelDisconnectedInDB";
import makeGetSessionInDB from "./setSessionInDB";

if (!process.env.DATABASE_FILE) {
  console.error("DATABASE_FILE not defined in .env using :memory:"); // eslint-disable-line no-console
}

const db = DBConnection.getConnectionSync();

export const getInitialChannelListFromDB = makeGetInitialChannelListFromDB(db);
export const getSessionFromDB = makeGetSessionFromDB(db);
export const setSessionInDB = makeGetSessionInDB(db);
export const setChannelConnectedInDB = makeSetChannelConnectedInDB(db);
export const setChannelDisconnectedInDB = makeSetChannelDisconnectedInDb(db);
export const deleteChannelFromDB = makeDeleteChannelFromDB(db);
