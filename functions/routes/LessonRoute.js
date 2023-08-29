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
router.get("/:lessonID", findLesson);
router.put("/:lessonID", updateLesson);
router.delete("/:lessonID", deleteLesson);

module.exports = router;
