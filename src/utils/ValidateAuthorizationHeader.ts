class AuthorizationValidationError extends Error {}

export default function ValidateAuthorizationHeader(header: string): string {
  if (!header.startsWith("Bearer ")) {
    throw new AuthorizationValidationError("not a `Bearer` token");
  }

  return header.split(" ")[1];
}
