import ExtractAuthorizationToken, {
  AuthorizationValidationError,
} from "./ValidateAuthorizationHeader";

test("good header", () => {
  let res = ExtractAuthorizationToken("Bearer abc");
  expect(res).toBe("abc");
});
test("good header with space", () => {
  let res = ExtractAuthorizationToken("Bearer abc efg");
  expect(res).toBe("abc efg");
});

test("bad header", () => {
  expect(() => {
    ExtractAuthorizationToken("Bearerabcdef");
  }).toThrow();
});

test("bad header", () => {
  expect(() => {
    ExtractAuthorizationToken("auth abcdef");
  }).toThrow();
});

test("AuthorizationValidationError sets message", () => {
  let err = new AuthorizationValidationError();

  expect(err.message).toBe("not a `Bearer` token");
});
