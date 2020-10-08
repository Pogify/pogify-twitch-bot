import { customAlphabet, nanoid } from "nanoid";
process.env.TWITCH_CLIENT_ID = nanoid();
import InitializeAuthDirectController from "./InitializeAuthDirectController";

let initializeAuthDirectController = new InitializeAuthDirectController();

beforeEach(() => {
  initializeAuthDirectController = new InitializeAuthDirectController();
});

const req: any = {};
req.protocol = "https";
req.hostname = customAlphabet("abcdefghijklmnop", 20)() + ".com";
const res: any = {};
res.redirect = jest.fn().mockReturnValue(res);

test("test redirect with proper stuff", async () => {
  await initializeAuthDirectController.execute(req, res);
  expect(res.redirect.mock.calls[0][0]).toMatchInlineSnapshot(
    `"https://id.twitch.tv/oauth2/authorize?redirect_uri=${req.protocol}%3A%2F%2F${req.hostname}%2Finit%2Fcallback&scope=chat%3Aread+chat%3Aedit&response_type=code&client_id=${process.env.TWITCH_CLIENT_ID}&force_verify=true"`
  );
});
