import { Database } from "sqlite3";
import DBConnection from "../DBConnection";

export default async function seededDevDB() {
  const db = await DBConnection.makeDBConnection(":memory:");
  let seed: [string, string, number][] = [
    ["test1", "sess1", 1],
    ["test2", "sess11", 1],
    ["test3", "sess2", 0],
    ["test4", "sess3", 1],
  ];
  const waits = [];
  for (let item of seed) {
    let promise = new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO channels (channel, session, connected) VALUES (?,?,?)",
        ...item,
        (err: any) => {
          resolve();
        }
      );
    });
    waits.push(promise);
  }

  await Promise.all(waits);

  return db;
}
