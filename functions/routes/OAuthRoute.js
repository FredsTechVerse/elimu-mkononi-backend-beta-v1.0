const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const scope = process.env.SCOPE;

// Create the OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

// An event listener triggered when new tokens are obtained / when existing tokens are refreshed.
oAuth2Client.on("tokens", (tokens) => {
  console.log(
    "A new bunch of tokens have been received!It must necessrily not contain the refresh token"
  );
  console.log({ tokens });
  if (tokens.refresh_token) {
    console.log({ refreshTokenToBeKeptSafely: tokens.refresh_token });
    // we should store the refresh_token in my database generically!
  }
});

router.get("/authorizationUri", (req, res) => {
  const authUri = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scope,
    include_granted_scopes: true,
  });
  res.status(200).json(authUri);
});

// For exchanging the code with a token.
router.post("/getToken", async (req, res) => {
  try {
    const { code } = req.body;
    if (code) {
      const { tokens } = await oAuth2Client.getToken(code);
      console.log({ tokens });
      oAuth2Client.setCredentials(tokens);
      res.status(200).json(tokens);
    } else {
      res.status(404).json({ message: "Code not found" });
    }
  } catch (error) {
    console.error(
      `Error while fetching youtube token ${JSON.stringify(error)}`
    );
    res.status(500).json(error);
  }
});

router.post("/refreshToken", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    console.log({ refreshToken });
    const credentials = await oAuth2Client.refreshToken(refreshToken);

    res.status(200).json({
      accessToken: credentials.tokens.access_token,
      expiresIn: credentials.tokens.expiry_date,
    });
  } catch (error) {
    console.error(
      `Error while renewing youtube token ${JSON.stringify(error)}`
    );
    res.status(500).json({ message: "Token refresh failed." });
  }
});

module.exports = router;
