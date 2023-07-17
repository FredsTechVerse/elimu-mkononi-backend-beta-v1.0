const express = require("express");
const router = express.Router();

// const { getSignedUrl } = require("../controllers/s3UploadController");
const {
  getSignedFileUrl,
  getFile,
} = require("../controllers/fileUploadController");

// router.post("/", getSignedUrl);
router.get("/:fileKey", getFile);
router.post("/", getSignedFileUrl);

module.exports = router;
