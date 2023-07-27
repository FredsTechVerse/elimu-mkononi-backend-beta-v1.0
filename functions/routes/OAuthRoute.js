const express = require("express");
const axios = require("axios");
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

oAuth2Client.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    // console.log(
    //   `Refresh Token generated ${JSON.stringify(tokens.refresh_token)}`
    // );
  }
  // console.log(`Access Token generated ${JSON.stringify(tokens.access_token)}`);
});

router.get("/authorizationUri", (req, res) => {
  const authUri = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scope,
    include_granted_scopes: true,
  });
  res.status(200).json(authUri);
});

router.post("/getToken", async (req, res) => {
  const { code } = req.body;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json("Failed to obtain access token");
  }
});

module.exports = router;
