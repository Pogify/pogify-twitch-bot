import { nanoid } from "nanoid";
import validateSessionID from "./ValidateSessionID";

test("valid session id", () => {
  let valid = validateSessionID(nanoid(5));

  expect(valid).toBe(true);
});

test("invalid session id", () => {
  let notvalid1 = validateSessionID("111111");
  expect(notvalid1).toBe(false);

  let notvalid2 = validateSessionID("$%#$^");
  expect(notvalid2).toBe(false);
});
