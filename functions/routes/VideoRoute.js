const express = require("express");
const router = express.Router();

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  createVideo,
  findVideo,
  findAllVideos,
  updateVideo,
  deleteVideo,
} = require("../controllers/VideoController");

router.post("/", createVideo);
router.get("/:videoID", findVideo);
router.get("/all-videos", findAllVideos);
router.put("/:videoID", updateVideo);
router.delete("/:videoID", deleteVideo);

module.exports = router;
