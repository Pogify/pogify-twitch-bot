import * as fs from "fs";
import * as path from "path";

var channels: { [key: string]: string } = {};
const channelsPath = process.cwd() + "/channels.json";

export async function getInitialChannelListFromDB(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(channelsPath)) {
      fs.readFile(path.join(channelsPath), (err, buffer) => {
        if (err) {
          console.info(err);
          return;
        }
        if (!buffer.length) {
          resolve([]);
          return;
        }

        channels = JSON.parse(buffer.toString("utf-8")) as {
          [key: string]: string;
        };
        resolve(Object.keys(channels));
      });
    } else {
      resolve([]);
    }
  });
}

export async function getSessionFromDB(channel: string): Promise<string> {
  return Promise.resolve(channels[channel] || "");
}

export async function setSession(
  channel: string,
  session: string
): Promise<void> {
  // upsert into db
  channels[channel] = session;
  fs.writeFile(channelsPath, JSON.stringify(channels, undefined, 2), () => {});
  return;
}

export async function removeChannelFromDB(channel: string): Promise<void> {
  delete channels[channel];
  return;
}
