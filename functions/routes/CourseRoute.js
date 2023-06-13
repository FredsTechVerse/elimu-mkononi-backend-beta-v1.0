require("dotenv/config");
const express = require("express");
const router = express.Router();

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  findAllCourses,
  findCourse,
  createCourse,
} = require("../controllers/CourseController");

router.get("/", (req, res) => {
  console.log("Welcome to course page.");
});

router.post("/new-course", createCourse);

// READING THE DOCUMENT
//======================
router.get("/all-courses", findAllCourses);

router.get(
  "/:courseID",
  (req, res, next) => {
    console.log("Request received");
    console.log(req.params);
    next();
  },
  findCourse
);
// EXPORTING A MODEL.

module.exports = router;
