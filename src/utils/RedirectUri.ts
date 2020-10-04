export default function redirectUri(proto: string, host: string): string {
  if (host === "localhost") return `${proto}://localhost:${process.env.PORT}/`;

  return `${proto}://${host}/`;
}
