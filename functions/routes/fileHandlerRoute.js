const express = require("express");
const router = express.Router();

const {
  getSignedFileUrl,
  getFile,
  deleteFile,
} = require("../controllers/fileUploadController");

router.get("/:fileKey", getFile);
router.post("/", getSignedFileUrl);
router.delete("/:fileKey", deleteFile);

module.exports = router;
