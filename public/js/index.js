let token = null;
let userProfile = null;
const twitchClientId = document.getElementById("client-id").dataset.clientId;
const statusDiv = document.getElementById("status");
const currentDiv = document.getElementById("current");

// self calling init function
(function init() {
  if (!window.location.hash) {
    return hideProfile();
  }

  token = parseHash(window.location.hash);

  if (!verifyToken(token)) return;

  if (!token.accessToken) return hideProfile();

  getProfileInformation().then(() => {
    setProfileDiv(userProfile.profile_image_url, userProfile.display_name);
    getCurrent();
  });
  history.replaceState(null, "", window.location.href.split("#")[0]);
  document.getElementById("signin-button").style.display = "none";
})();

function hideProfile() {
  document.getElementById("profile").style.display = "none";
}

function signin() {
  const params = new URLSearchParams();
  const state = randomString(20);
  const nonce = randomString(20);
  window.sessionStorage.setItem("twitch:state", state);

  params.set("redirect_uri", window.location.href);
  params.set("response_type", "token");
  params.set("client_id", twitchClientId);
  params.set("state", state);
  params.set("force_verify", "true");
  window.location.href = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
}

function verifyToken(token) {
  const storedState = window.sessionStorage.getItem("twitch:state");
  if (token.state && token.state === storedState) {
    return true;
  }
  return false;
}
function signout() {
  window.location.hash = "";
  token = null;
  userProfile = null;
  document.getElementById("signin-button").style.display = "block";
  document.getElementById("profile").style.display = "none";
}

function parseHash(hash) {
  const parts = hash.substr(1).split("&");

  return parts.reduce((acc, cur) => {
    const split = cur.split("=");
    acc[split[0]] = split[1];
    return acc;
  }, {});
}

async function getProfileInformation() {
  if (!token.access_token) return;

  const profileInfoRes = await axios.get("https://api.twitch.tv/helix/users", {
    headers: {
      authorization: `Bearer ${token.access_token}`,
      "client-id": twitchClientId,
    },
  });

  userProfile = profileInfoRes.data.data[0];
}

function setProfileDiv(img, username) {
  document.getElementById("profile-img").src = img;
  document.getElementById("profile-username").innerHTML = username;
}

function connect() {
  if (!token) return;

  axios
    .post("/join", undefined, {
      headers: {
        authorization: `Bearer ${token.access_token}`,
      },
    })
    .then((res) => {
      statusDiv.innerText = `Pogify bot joined: ${res.data}`;
    })
    .catch(() => {
      statusDiv.innerText = "Pogify bot error. try again.";
    });
}

function disconnect() {
  if (!token) return;

  axios
    .post("/part", undefined, {
      headers: {
        authorization: `Bearer ${token.access_token}`,
      },
    })
    .then((res) => {
      statusDiv.innerText = `Pogify bot left: ${res.data}`;
    })
    .catch(() => {
      statusDiv.innerText = "Pogify bot error. try again.";
    });
}

function getCurrent() {
  if (!token) return;

  axios
    .get("/current", {
      headers: {
        authorization: `Bearer ${token.access_token}`,
      },
    })
    .then((res) => {
      currentDiv.innerText = `Current session: ${res.data}`;
    })
    .catch((e) => {
      if (e.response && e.response.status === 404) {
        currentDiv.innerText = "No session";
      }
    });
}

function set() {
  if (!token) return;
  const sessionId = document.getElementById("session-id").value;
  axios
    .post("/set", undefined, {
      params: {
        sessionId,
      },
      headers: {
        authorization: `Bearer ${token.access_token}`,
      },
    })
    .then((res) => {
      currentDiv.innerText = `Current session: ${res.data}`;
    })
    .catch((e) => {
      if (e.response && e.response.status == 400) {
        currentDiv.innerText = e.response.data;
        return;
      }
      currentDiv.innerText = "";
    });
}

function randomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
