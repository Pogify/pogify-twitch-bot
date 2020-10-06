process.env.DATABASE_FILE = undefined;
import { Database } from "sqlite3";
import DBConnection from "./DBConnection";

beforeEach(() => {
  process.env.DATABASE_FILE = undefined;
  // @ts-ignore
  DBConnection.instance = undefined;
});

describe("test makeDBConnection", () => {
  //
  test("fallback memory shouldn't err", (done) => {
    let db = DBConnection.makeDBConnection().then((db) => {
      // @ts-ignore
      console.log(db);
      done();
    });
  });
});

describe("getConnection", () => {
  test("no prior instance", async () => {
    let connection = await DBConnection.getConnection();
    expect(connection).toBeInstanceOf(Database);
  });
  test("with prior instance", async () => {
    await DBConnection.getConnection();
    let connection = await DBConnection.getConnection();
    expect(connection).toBeInstanceOf(Database);
  });
});

describe("getConnectionSync", () => {
  test("no prior instance", () => {
    let connection = DBConnection.getConnectionSync();
    expect(connection).toBeInstanceOf(Database);
  });
  test("with prior instance", () => {
    DBConnection.getConnectionSync();
    let connection = DBConnection.getConnectionSync();
    expect(connection).toBeInstanceOf(Database);
  });
});
