import { nanoid } from "nanoid";
import { Database } from "sqlite3";
import seededDevDB from "../__testutils__/seededDB";
import makeSetSessionInDB from "./setSessionInDB";

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
  expect(makeSetSessionInDB({} as Database)).toBeInstanceOf(Function);
});

test("test upsert", async (done) => {
  const setSessionInDB = makeSetSessionInDB(db);
  const session = nanoid(5);
  await setSessionInDB("test1", session);

  db.get("SELECT session FROM channels WHERE channel = \"test1\"", (err, res) => {
    expect(err).toBeFalsy();
    expect(res.session).toEqual(session);
    done();
  });
});

test("test insert", async (done) => {
  const setSessionInDB = makeSetSessionInDB(db);
  const session = nanoid(5);
  const channel = nanoid(5);
  await setSessionInDB(channel, session);

  db.get(
    `SELECT session FROM channels WHERE channel = "${channel}"`,
    (err, res) => {
      expect(err).toBeFalsy();
      expect(res.session).toEqual(session);
      done();
    }
  );
});

test("test function err", async () => {
  const db = new Database(":memory:");
  const setSessionInDB = makeSetSessionInDB(db);
  const session = nanoid(5);
  let e: any;
  try {
    await setSessionInDB("test1", session);
  } catch (err) {
    e = err;
  }
  expect(e).toBeTruthy();
});
