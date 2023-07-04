const express = require("express");
const router = express.Router();

const AWS = require("aws-sdk");
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  httpOptions: {
    timeout: 45000, // Set a higher timeout value in milliseconds
  },
});
const {
  getFileStream,
  getSignedUrl,
} = require("../controllers/s3UploadController");

const bucketName = process.env.AWS_BUCKET_NAME;

router.get("/:key", async (req, res) => {
  try {
    const key = req.params.key;

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const headObjectResponse = await s3.headObject(params).promise();
    const videoSize = headObjectResponse.ContentLength;

    let start = 0;
    let end = videoSize - 1;

    // Check for seek position in query parameters
    const { seek } = req.query;
    if (seek) {
      const seekPosition = parseInt(seek, 10);
      if (
        !isNaN(seekPosition) &&
        seekPosition >= 0 &&
        seekPosition < videoSize
      ) {
        start = seekPosition;
      }
    }

    const chunkSize = end - start + 1;

    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    }

    const rangeHeader = `bytes ${start}-${end}/${videoSize}`;

    const readStream = await getFileStream(key, { start, end });

    // FEW DEBUGGING TECHNIQUES
    // ============================
    readStream.on("error", (error) => {
      console.error("Stream error:", error);
      res.status(500).send("An error occurred while streaming the video.");
    });

    readStream.on("end", () => {
      console.log("Stream ended");
    });
    res.writeHead(206, {
      "Content-Range": rangeHeader,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

router.post("/", getSignedUrl);

module.exports = router;
