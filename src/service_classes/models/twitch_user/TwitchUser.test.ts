import Axios from "axios";
import { nanoid } from "nanoid";
import { TwitchUser } from "./TwitchUser";
import TwitchConstants from "../../../constants/TwitchConstants.json";

const mockAdapter = jest.fn().mockReturnValue(
  Promise.resolve({
    data: {
      data: [
        {
          foo: "bar",
        },
      ],
    },
  })
);
Axios.defaults.adapter = mockAdapter;
test("test", async () => {
  const token = nanoid();
  let testRes = await TwitchUser.FetchUser({ token });

  expect(testRes).toMatchObject({ foo: "bar" });
});
