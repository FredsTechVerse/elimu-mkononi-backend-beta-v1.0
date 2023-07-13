const express = require("express");
const router = express.Router();

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  findAllCourses,
  findCourse,
  createCourse,
} = require("../controllers/CourseController");

router.post("/new-course", createCourse);

// READING THE DOCUMENT
//======================
router.get("/all-courses", findAllCourses);

router.get("/:courseID", findCourse);
// EXPORTING A MODEL.

module.exports = router;
