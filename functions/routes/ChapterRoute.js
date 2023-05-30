const express = require("express");
const router = express.Router();

const {
  createChapter,
  findAllChapters,
  findChapter,
  populateChapterLessons,
} = require("../controllers/ChapterController");
// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
router.post("/new-chapter", createChapter);

// READING THE DOCUMENT
//======================
router.get("/all-chapters", findAllChapters);

router.get("/:chapterId", findChapter);

router.get("/all-chapters-lessons", populateChapterLessons);

// EXPORTING A MODEL.
module.exports = router;
