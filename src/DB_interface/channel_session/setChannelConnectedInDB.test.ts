import { Database } from "sqlite3";
import seededDevDB from "../__testutils__/seededDB";
import makeSetChannelConnectedInDB from "./setChannelConnectedInDB";

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
  expect(makeSetChannelConnectedInDB({} as Database)).toBeInstanceOf(Function);
});

test("test function", async (done) => {
  let setChannelConnectedInDB = makeSetChannelConnectedInDB(db);
  await setChannelConnectedInDB("test3");

  db.get(
    'SELECT connected FROM channels WHERE channel = "test3"',
    (err, res) => {
      expect(err).toBeFalsy();
      expect(res.connected).toEqual(1);
      done();
    }
  );
});

test("test function err", async () => {
  let db = new Database(":memory:");
  let setChannelConnectedInDB = makeSetChannelConnectedInDB(db);
  let e: any;
  try {
    await setChannelConnectedInDB("test1");
  } catch (err) {
    e = err;
  }
  expect(e).toBeTruthy();
});
