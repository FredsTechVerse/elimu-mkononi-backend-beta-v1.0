const express = require("express");
const router = express.Router();

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  aggregateLessons,
  createLesson,
  findLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/LessonController");

router.post("/", createLesson);
router.get("/aggregated", aggregateLessons);
router.get("/:videoID", findLesson);
router.put("/:videoID", updateLesson);
router.delete("/:videoID", deleteLesson);

module.exports = router;
