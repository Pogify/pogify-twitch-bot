import { Database } from "sqlite3";
import DBConnection from "./DBConnection";

beforeEach(() => {
  // @ts-ignore
  DBConnection.instance = undefined;
});

describe("test makeDBConnection", () => {
  //
  test("fallback memory shouldn't err", (done) => {
    const db = DBConnection.makeDBConnection().then((db) => {
      // @ts-ignore
      console.log(db);
      done();
    });
  });
});

describe("getConnection", () => {
  test("no prior instance", async () => {
    const connection = await DBConnection.getConnection();
    expect(connection).toBeInstanceOf(Database);
  });
  test("with prior instance", async () => {
    await DBConnection.getConnection();
    const connection = await DBConnection.getConnection();
    expect(connection).toBeInstanceOf(Database);
  });
});

describe("getConnectionSync", () => {
  test("no prior instance", () => {
    const connection = DBConnection.getConnectionSync();
    expect(connection).toBeInstanceOf(Database);
  });
  test("with prior instance", () => {
    DBConnection.getConnectionSync();
    const connection = DBConnection.getConnectionSync();
    expect(connection).toBeInstanceOf(Database);
  });
});
