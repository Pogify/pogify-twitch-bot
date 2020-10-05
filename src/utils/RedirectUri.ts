export default function redirectUri(
  proto: string,
  host: string,
  path: string
): string {
  if (host === "localhost")
    return `${proto}://localhost:${process.env.PORT}${path}`;

  return `${proto}://${host}${path}`;
}
