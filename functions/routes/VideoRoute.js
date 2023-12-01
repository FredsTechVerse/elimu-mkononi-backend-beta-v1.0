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
router.get("/", (req, res) => {
  res.status(200).send("You have reached videos route");
});
router.post("/", createVideo);
router.get("/all-videos", findAllVideos);
router.get("/:videoID", findVideo);
router.put("/:videoID", updateVideo);
router.delete("/:videoID", deleteVideo);

module.exports = router;
