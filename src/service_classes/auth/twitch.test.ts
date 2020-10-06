import Axios, { AxiosAdapter, AxiosPromise } from "axios";
import { FetchToken } from "./twitch";

const mockAdapter = jest.fn().mockReturnValue(
  Promise.resolve({
    data: {
      access_token: "access_token",
    },
  })
);
Axios.defaults.adapter = mockAdapter;

process.env.TWITCH_CLIENT_ID = "client_id";
process.env.TWITCH_CLIENT_SECRET = "client_secret";

test("test", async () => {
  await FetchToken({ code: "abc", redirectUri: "redirect/uri" });
  expect(mockAdapter.mock.calls[0][0].url).toMatch(
    "https://id.twitch.tv/oauth2/token?client_id=client_id&client_secret=client_secret&code=abc&grant_type=authorization_code&redirect_uri=redirect%2Furi"
  );
});
