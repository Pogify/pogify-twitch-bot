import { Database } from "sqlite3";
import seededDevDB from "../__testutils__/seededDB";
import makeGetSessionFromDB from "./getSessionFromDB";

let db: Database;

beforeEach(async () => {
  db = await seededDevDB();
});

afterEach(() => {
  return new Promise((resolve, reject) => {
    db.close(() => {
      resolve();
    });
  });
});

test("test closure returns function", () => {
  expect(makeGetSessionFromDB({} as Database)).toBeInstanceOf(Function);
});

test("test exists", async () => {
  const getSessionFromDB = makeGetSessionFromDB(db);
  const session = await getSessionFromDB("test1");

  expect(session).toEqual("sess1");
});
test("test doesn't exist", async () => {
  const getSessionFromDB = makeGetSessionFromDB(db);
  const session = await getSessionFromDB("randomchannel");

  expect(session).toEqual("");
});

test("test function err", async () => {
  const db = new Database(":memory:");
  const getSessionFromDB = makeGetSessionFromDB(db);
  let e: any;
  try {
    await getSessionFromDB("test1");
  } catch (err) {
    e = err;
  }
  expect(e).toBeTruthy();
});
