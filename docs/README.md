[![Maintainability](https://api.codeclimate.com/v1/badges/da79a4541613fa641d29/maintainability)](https://codeclimate.com/github/Pogify/pogify-twitch-bot/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/da79a4541613fa641d29/test_coverage)](https://codeclimate.com/github/Pogify/pogify-twitch-bot/test_coverage)
![David DM](https://david-dm.org/pogify/pogify-twitch-bot.svg)
[![devDependencies Status](https://david-dm.org/pogify/pogify-twitch-bot/dev-status.svg)](https://david-dm.org/pogify/pogify-twitch-bot?type=dev)
![CI](https://github.com/Pogify/pogify-twitch-bot/workflows/CI/badge.svg)

[![Total alerts](https://img.shields.io/lgtm/alerts/g/Pogify/pogify-twitch-bot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Pogify/pogify-twitch-bot/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Pogify/pogify-twitch-bot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Pogify/pogify-twitch-bot/context:javascript)


[![Pull Requests Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com) 
[![first-timers Friendly](https://img.shields.io/badge/first--timers-friendly-blue.svg)](http://www.firsttimersonly.com/)
[![GitHub license](https://img.shields.io/github/license/pogify/pogify-twitch-bot.svg)](https://github.com/pogify/pogify-twitch-bot/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/pogify/pogify-twitch-bot.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/pogify/pogify-twitch-bot/stargazers/)

# pogify-twitch-bot

Twitch chatbot for pogify

This package is also an API.

## Chatbot commands

> trigger: `!pogify`

### `!pogify` (no arguments)

- chatbot sends a url to the currently set pogify session.
- if no session, sends nothing

### `!pogify ping`

> Broadcaster Only

- chatbot sends `pong` in chat.
- should be used to check if the chatbot is connected.

### `!pogify set {sessionId}`

> Broadcaster Only

- sets the session for a channel.
- chatbot will return a success or failure message

### `!pogify disconnect`

> Broadcaster Only

- disconnects the chatbot from the chat.

### `!pogify create`

> Broadcaster Only

- chatbot sends the url to create a session.
- doesn't automatically create a new session (yet).

## Not-API endpoints:

### `GET` /

- console page for broadcasters to connect the chatbot.
- broadcasters sign in through twitch, and obtain a token
  - token scope: nothing
- token is used to verify identity for chatbot api.
- once authenticated, ui allows broadcasters to connect, disconnect, and set session IDs just as they can with chat commands.

### `GET` /init

- page has one button that redirects to twitch auth.
- the callback (`/init/callback`) automatically runs identity verification and initializes the chatbot.
- if the signed in account username doesn't match the one that is declared by `BOT_USERNAME` in the `.env` file then the callback will error.

### `GET` /init/callback

- callback uri for twitch auth to initialize chatbot.

## API Endpoints:

All endpoints with the exception of the root `/`, init `/init`, and init callback `/init/callback` require a authorization bearer header with an oauth token issued by this chatbot only.

- unauthenticated calls will return with status code 401.

#### Note: API endpoints will return with status code 503 if the chatbot has not been initialized with `/init`

### `POST` /join

- chatbot will join the chat of the channel specified by the oauth token.

### `POST` /part

- chatbot will leave the chat of the channel specified by the oauth token.

### `POST` /set?sessionId={sessionId}

- API will set the session to return on a `!pogify` command.

### `GET` /current

- API will return the currently set session

## Considerations:

1. using oidc id_tokens would allow tokens issued by other client_ids to be used here as long as it's registered as a valid `aud`. However, that then means that emails are also as part of the token scope which is both unnecessary and may cause some friction for people weary about pogify asking for their email.
   - means that we need to request the user from the `get users` endpoint of the Twitch API.
   - or maybe just have a shared secret to give the pogify api a direct line into the bot.
   - or maybe just use the same client_id for both the pogify api and pogify_bot?
2. issue pogify tokens? (is that really necessary?)
3. port to golang for the additional performance.
4. migrate off of sqlite3. but also probably wouldn't use that much storage for it anyways...
5. periodically disconnect inactive channels?
   - how often?
   - what would be the parameters to disconnect?
   - if kept connected then would just always be reading chats.

## TODO:

- better UI.
  - current ui is barebones.
- ~~tests~~
- [ ] no fetch retry. should add
- [ ] integration tests
