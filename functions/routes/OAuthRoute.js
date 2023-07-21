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
    console.log(
      `Refresh Token generated ${JSON.stringify(tokens.refresh_token)}`
    );
  }
  console.log(`Access Token generated ${JSON.stringify(tokens.access_token)}`);
});

router.get("/authorizationUri", (req, res) => {
  const authUri = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scope,
    include_granted_scopes: true,
  });
  console.log("Authorization URI generated:", authUri);
  res.status(200).json(authUri);
});

// router.get("/getToken", async (req, res) => {
//   try {
//     const { code } = req.query;
//     const tokenEndpoint = process.env.TOKEN_END_POINT;
//     const clientId = process.env.CLIENT_ID;
//     const clientSecret = process.env.CLIENT_SECRET;
//     const redirectUri = process.env.REDIRECT_URI;

//     const response = await axios.post(tokenEndpoint, {
//       code: code,
//       client_id: clientId,
//       client_secret: clientSecret,
//       redirect_uri: redirectUri,
//       grant_type: "authorization_code",
//     });

//     const accessToken = response.data.access_token;
//     const expiresIn = response.data.expires_in;
//     console.log(
//       `Access Token :${JSON.stringify(
//         accessToken
//       )} Expires In :${JSON.stringify(expiresIn)}`
//     );
//     res.json(accessToken);
//   } catch (error) {
//     console.error("Error exchanging code for access token:", error);
//     res.status(500).json("Failed to obtain access token");
//   }
// });

router.post("/getToken", async (req, res) => {
  const { code } = req.body;
  // const tokenEndpoint = process.env.TOKEN_END_POINT;
  // const clientId = process.env.CLIENT_ID;
  // const clientSecret = process.env.CLIENT_SECRET;
  // const redirectUri = process.env.REDIRECT_URI;

  // console.log({ code, tokenEndpoint, clientId, clientSecret, redirectUri });
  try {
    console.log(`Code passed ${JSON.stringify(code)}`);
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Error exchanging code for access token:", error);
    res.status(500).json("Failed to obtain access token");
  }

  // axios
  //   .post(tokenEndpoint, {
  //     code,
  //     client_id: clientId,
  //     client_secret: clientSecret,
  //     redirect_uri: redirectUri,
  //     grant_type: "authorization_code",
  //   })
  //   .then((response) => {
  //     const accessToken = response.data.access_token;
  //     const expiresIn = response.data.expires_in;
  //     console.log(
  //       `Access Token :${JSON.stringify(
  //         accessToken
  //       )} Expires In :${JSON.stringify(expiresIn)}`
  //     );
  //     res.json(accessToken);
  //   })
  //   .catch((error) => {
  //     console.error("Error exchanging code for access token:", error);
  //     res.status(500).json("Failed to obtain access token");
  //   });
});

module.exports = router;
