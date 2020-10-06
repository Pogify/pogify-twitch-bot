import { Database } from "sqlite3";
import path from "path";

export default class DBConnection {
  static instance: Database;

  static async makeDBConnection(databaseUri?: string): Promise<Database> {
    // either use databaseUri arg or use process.env.Database_file or :memory:
    const db = new Database(
      databaseUri ||
        (process.env.DATABASE_FILE
          ? path.join(process.cwd(), "db", process.env.DATABASE_FILE)
          : ":memory:")
    );
    this.instance = db;
    await this.makeTables(db);
    return db;
  }

  public static async getConnection(): Promise<Database> {
    if (this.instance) {
      return this.instance;
    }

    await this.makeDBConnection();
    return this.instance;
  }

  public static getConnectionSync(): Database {
    this.getConnection();
    return this.instance;
  }

  // just for sqlite3. use an orm and proper migrations for anything else
  private static async makeTables(db: Database): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS channels (
       channel TEXT UNIQUE PRIMARY KEY NOT NULL,
       session TEXT NOT NULL,
       connected INTEGER DEFAULT 1
     )`,
        (err: unknown) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
