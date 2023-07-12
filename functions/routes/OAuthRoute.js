const express = require("express");
const axios = require("axios");
const router = express.Router();
const { google } = require("googleapis");
require("dotenv").config();

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

router.get("/authorizationUri", (req, res) => {
  const authUri = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scope,
  });
  console.log("Authorization URI:", authUri);
  res.status(200).send(authUri);
});

router.get("/getToken", (req, res) => {
  const { code } = req.query;
  const tokenEndpoint = process.env.TOKEN_END_POINT;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  axios
    .post(tokenEndpoint, {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    })
    .then((response) => {
      const accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;
      console.log(
        `Access Token :${JSON.stringify(
          accessToken
        )} Expires In :${JSON.stringify(expiresIn)}`
      );
      res.send(accessToken);
    })
    .catch((error) => {
      console.error("Error exchanging code for access token:", error);
      res.status(500).send("Failed to obtain access token");
    });
});

router.post("/getToken", (req, res) => {
  const { code } = req.body;
  const tokenEndpoint = process.env.TOKEN_END_POINT;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  console.log({ tokenEndpoint, clientId, clientSecret, redirectUri });

  axios
    .post(tokenEndpoint, {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    })
    .then((response) => {
      const accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;
      console.log(
        `Access Token :${JSON.stringify(
          accessToken
        )} Expires In :${JSON.stringify(expiresIn)}`
      );
      res.send(accessToken);
    })
    .catch((error) => {
      console.error("Error exchanging code for access token:", error);
      res.status(500).send("Failed to obtain access token");
    });
});

module.exports = router;
