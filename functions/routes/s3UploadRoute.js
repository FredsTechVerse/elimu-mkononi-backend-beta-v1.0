const express = require("express");
const router = express.Router();

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const {
  getFileStream,
  getSignedUrl,
} = require("../controllers/s3UploadController");

const bucketName = process.env.AWS_BUCKET_NAME;
// WITH FUNCTION FOR RETRIEVING FILE SIZE
router.get("/:key", async (req, res) => {
  try {
    const key = req.params.key;

    const params = {
      Bucket: bucketName,
      Key: key,
    };
    const headObjectResponse = await s3.headObject(params).promise();
    const videoSize = headObjectResponse.ContentLength;
    const readStream = await getFileStream(key);
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      readStream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": videoSize,
        "Content-Type": "video/mp4",
      });

      readStream.pipe(res);
    }
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

router.post("/", getSignedUrl);

module.exports = router;
