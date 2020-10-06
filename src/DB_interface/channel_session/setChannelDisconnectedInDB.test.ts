import { Database } from "sqlite3";
import seededDevDB from "../__testutils__/seededDB";
import makeSetChannelDisconnectedInDB from "./setChannelDisconnectedInDB";

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
  expect(makeSetChannelDisconnectedInDB({} as Database)).toBeInstanceOf(
    Function
  );
});

test("test function", async (done) => {
  let setChannelDisconnectedInDB = makeSetChannelDisconnectedInDB(db);
  await setChannelDisconnectedInDB("test1");

  db.get(
    'SELECT connected FROM channels WHERE channel = "test1"',
    (err, res) => {
      expect(err).toBeFalsy();
      expect(res.connected).toEqual(0);
      done();
    }
  );
});

test("test function err", async () => {
  let db = new Database(":memory:");
  let setChannelDisconnectedInDB = makeSetChannelDisconnectedInDB(db);
  let e: any;
  try {
    await setChannelDisconnectedInDB("test1");
  } catch (err) {
    e = err;
  }
  expect(e).toBeTruthy();
});
