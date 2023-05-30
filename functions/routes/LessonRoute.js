const express = require("express");
const router = express.Router();

// CONTROLLERS IMPORTATIONS.
//===========================
const { createLesson, findLesson } = require("../controllers/LessonController");

router.post("/new-lesson", createLesson);

router.get("/:lessonId", findLesson);

// EXPORTING A MODEL.
module.exports = router;
