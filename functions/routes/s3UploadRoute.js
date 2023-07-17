const express = require("express");
const router = express.Router();

const { getSignedUrl } = require("../controllers/s3UploadController");
const {
  getSignedFileUrl,
} = require("../controllers/fileUploadControllers.jsx");

// router.post("/", getSignedUrl);
router.post("/", getSignedFileUrl);

module.exports = router;
