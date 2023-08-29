const express = require("express");
const router = express.Router();

const {
  aggregateCourses,
  findAllCourses,
  findCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/CourseController");

router.post("/", createCourse);
router.get("/aggregated", aggregateCourses);
router.get("/all-courses", findAllCourses);
router.get("/:courseID", findCourse);
router.put("/:courseID", updateCourse);
router.delete("/:courseID", deleteCourse);

module.exports = router;
