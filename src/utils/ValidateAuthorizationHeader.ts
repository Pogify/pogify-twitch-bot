export class AuthorizationValidationError extends Error {
  message = "not a `Bearer` token";
}

export default function ExtractAuthorizationToken(header: string): string {
  if (!header.startsWith("Bearer ")) {
    throw new AuthorizationValidationError();
  }

  return header.split(" ").slice(1).join(" ");
}
