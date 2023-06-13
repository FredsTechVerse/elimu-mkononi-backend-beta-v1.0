// MODEL IMPORTATION
//===================
const Course = require("../models/CourseModel");
// ERROR HANDLING
const { handleError } = require("./ErrorHandling");

const createCourse = async (req, res) => {
  try {
    console.log(req.body);
    let { courseTitle, courseImage } = req.body;
    let courseData = { courseTitle, courseImage };
    let newCourse = await Course.create(courseData);
    newCourse.save();
    res.sendStatus(201);
  } catch (err) {
    handleError(err);
  }
};

const findAllCourses = async (req, res) => {
  // All the data will already be appended by the units.
  try {
    let data = await Course.find({}); //Find everything for me.
    res.json(data);
  } catch (err) {
    handleError(err);
  }
};
const findCourse = async (req, res) => {
  // All the data will already be appended by the units.
  const { courseID } = req.params;
  try {
    let data = await Course.findById(courseID).populate("units"); //Find everything for me.
    res.json(data);
  } catch (err) {
    handleError(err);
  }
};
module.exports = {
  findAllCourses,
  findCourse,
  createCourse,
};
