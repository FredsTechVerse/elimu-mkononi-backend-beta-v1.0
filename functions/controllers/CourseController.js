const Course = require("../models/CourseModel");
const { handleError } = require("./ErrorHandling");

const createCourse = async (req, res) => {
  try {
    let { courseTitle, courseImage } = req.body;
    let courseData = { courseTitle, courseImage };
    let newCourse = await Course.create(courseData);
    newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    handleError(err);
  }
};

const findAllCourses = async (req, res) => {
  try {
    let courseData = await Course.find({});
    res.json(courseData);
  } catch (err) {
    handleError(err);
  }
};
const findCourse = async (req, res) => {
  const { courseID } = req.params;
  try {
    let courseData = await Course.findById(courseID).populate("units"); //Find everything for me.
    res.json(courseData);
  } catch (err) {
    handleError(err);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseID } = req.params;
    await Course.findByIdAndDelete(courseID);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    handleError(err);
  }
};

module.exports = {
  findAllCourses,
  findCourse,
  createCourse,
  deleteCourse,
};
