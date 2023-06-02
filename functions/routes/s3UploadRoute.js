const express = require("express");
const router = express.Router();

const debugReq = (req, res, next) => {
  console.log("Get request for course data acknowledged.");
  next();
};

// Importing the controllers needed.
const {
  getFileStream,
  getSignedUrl,
} = require("../controllers/s3UploadController");

// const {
//   getFileStream,
//   getSignedUrl,
// } = require("../controllers/fileUploadController");

// Defining the routes.
// router.get("/:key", debugReq, async (req, res) => {
//   try {
//     const key = req.params.key;
//     console.log(key);
//     // Extremely crucial to await the data being sent to the client.
//     const readStream = await getFileStream(key);
//     readStream.pipe(res);
//   } catch (err) {
//     console.log(err);
//     res.status(404).send(err);
//   }
// });

router.get("/:key", async (req, res) => {
  try {
    const key = req.params.key;
    const readStream = await getFileStream(key);

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Accept-Ranges", "bytes");

    readStream.on("data", (chunk) => {
      res.write(chunk);
      console.log("Data is being sent in chunks!");
    });

    readStream.on("end", () => {
      res.end();
      console.log("Data transfer complete!");
    });

    readStream.on("error", (err) => {
      console.log(err);
      res.status(500).send(err);
    });
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

// router.get("/:key", async (req, res) => {
//   try {
//     const key = req.params.key;
//     const readStream = await getFileStream(key);

//     const { size } = await getFileMetadata(key);
//     const range = req.headers.range;

//     if (range) {
//       const [start, end] = range.replace("bytes=", "").split("-");
//       const chunkSize = end ? parseInt(end) - parseInt(start) + 1 : size;
//       const contentRange = `bytes ${start || 0}-${end || size - 1}/${size}`;

//       res.status(206);
//       res.setHeader("Content-Range", contentRange);
//       res.setHeader("Accept-Ranges", "bytes");
//       res.setHeader("Content-Length", chunkSize);
//     } else {
//       res.setHeader("Content-Length", size);
//     }

//     res.setHeader("Content-Type", "video/mp4");

//     readStream.pipe(res);
//   } catch (err) {
//     console.log(err);
//     res.status(404).send(err);
//   }
// });

router.post("/", getSignedUrl);

module.exports = router;
