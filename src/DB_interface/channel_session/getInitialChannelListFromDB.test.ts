import { Database } from "sqlite3";
import seededDevDB from "../__testutils__/seededDB";
import makeGetInitialChannelListFromDB from "./getInitialChannelListFromDB";

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
  expect(makeGetInitialChannelListFromDB({} as Database)).toBeInstanceOf(
    Function
  );
});

test("test function", async () => {
  const getInitialChannelListFromDB = makeGetInitialChannelListFromDB(db);
  const initialList = await getInitialChannelListFromDB();

  expect(initialList.sort()).toEqual(["test1", "test2", "test4"]);
});

test("test function err", async () => {
  const db = new Database(":memory:");
  const getInitialChannelListFromDB = makeGetInitialChannelListFromDB(db);
  let e: any;
  try {
    await getInitialChannelListFromDB();
  } catch (err) {
    e = err;
  }
  expect(e).toBeTruthy();
});
