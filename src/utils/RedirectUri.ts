import { resolve } from "url";

export default function redirectUri(
  proto: string,
  host: string,
  path?: string
): string {
  let base: string;
  if (host === "localhost") {
    base = `${proto}://localhost:${process.env.PORT}`;
  } else {
    base = `${proto}://${host}`;
  }

  if (path) {
    return resolve(base, path);
  }
  return base;
}
