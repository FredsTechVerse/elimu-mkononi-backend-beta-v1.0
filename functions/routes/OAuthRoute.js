const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
require("dotenv").config();
// Configuration
// The api key is used to make api request that do not require user authorizations eg fetching public channeels
// We need to use OAUTH 2.0 credentials for requests that require user authorization.
// Uploading videos is easy.... As long as i can do it on the backend even the frontend should be a piece of cake as the unifying factor is axios.
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const scope = process.env.VIDEO_UPLOAD_LINK;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
console.log({ clientId, clientSecret, redirectUri, scope, secretAccessKey });
// Create the OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

// Set the access token in the OAuth2 client
oAuth2Client.setCredentials({ access_token: "<access_token>" });

// This is how were are calling the auth generation functions.
router.get("/authorizationUrl", (req, res) => {
  // Generate the redirect URL
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scope,
  });
  console.log("Authorization URL:", authUrl);
  res.status(200).send(authUrl);
});

router.get("/callback", (req, res) => {
  const code = req.query.code;
  if (code) {
    oAuth2Client.getToken(code, (err, tokens) => {
      if (err) {
        throw err;
      }
      console.log(`Successfully authenticated ${JSON.stringify(tokens)}`);
      oAuth2Client.setCredentials(tokens);
      res.status(200).json({ authToken: tokens });
    });
  }
});

// Upload video
router.post("/upload", async (req, res) => {
  try {
    const youtube = google.youtube({
      version: "v3",
      auth: oAuth2Client,
    });

    const videoPath = "<path_to_video_file>";

    const response = await youtube.videos.insert({
      part: "snippet,status",
      media: {
        body: fs.createReadStream(videoPath),
      },
      requestBody: {
        snippet: {
          title: "My Video Title",
          description: "My Video Description",
        },
        status: {
          privacyStatus: "private",
        },
      },
    });

    console.log("Video uploaded successfully:", response.data);

    res.status(200).json({ message: "Video uploaded successfully" });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

module.exports = router;
