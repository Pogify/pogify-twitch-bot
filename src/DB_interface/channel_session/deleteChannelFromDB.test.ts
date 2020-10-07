import { Database } from "sqlite3";
import seededDevDB from "../__testutils__/seededDB";
import makeDeleteChannelFromDB from "./deleteChannelFromDB";

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
  expect(makeDeleteChannelFromDB({} as Database)).toBeInstanceOf(Function);
});

test("test function ", async (done) => {
  const deleteChannelFromDB = makeDeleteChannelFromDB(db);
  await deleteChannelFromDB("test1");

  db.all("SELECT channel FROM channels WHERE channel = \"test1\"", (err, row) => {
    expect(err).toBeFalsy();
    expect(row).toHaveLength(0);
    done();
  });
});

test("test function err", async () => {
  const db = new Database(":memory:");
  const deleteChannelFromDB = makeDeleteChannelFromDB(db);
  let e: any;
  try {
    await deleteChannelFromDB("test1");
  } catch (err) {
    e = err;
  }
  expect(e).toBeTruthy();
});
