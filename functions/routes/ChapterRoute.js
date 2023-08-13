const express = require("express");
const router = express.Router();

const {
  createChapter,
  findAllChapters,
  findChapter,
  populateChapterLessons,
  updateChapter,
  deleteChapter,
} = require("../controllers/ChapterController");

router.post("/", createChapter);
router.get("/all-chapters", findAllChapters);
router.get("/:chapterID", findChapter);
router.get("/all-chapters-lessons", populateChapterLessons);
router.put("/:chapterID", updateChapter);
router.delete("/:chapterID", deleteChapter);

module.exports = router;
