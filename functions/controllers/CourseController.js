// MODEL IMPORTATION
//===================
const Course = require("../models/CourseModel");

const createCourse = async (req, res) => {
  try {
    console.log(req.body);
    let { courseTitle, courseImage } = req.body;
    let courseData = { courseTitle, courseImage };
    let newCourse = await Course.create(courseData);
    newCourse.save();
    res.sendStatus(201);
  } catch (err) {
    // DESTRUCTURING MONGODB ATLAS ERROR.
    if (err.code == 11000) {
      res.sendStatus(409);
    } else {
      console.log(JSON.stringify(err));
      let { _message, name } = err;
      let errorBody = { _message, name };
      res.status(400).json(errorBody);
    }
  }
};

const findAllCourses = async (req, res) => {
  // All the data will already be appended by the units.
  try {
    let data = await Course.find({}); //Find everything for me.
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
const findCourse = async (req, res) => {
  // All the data will already be appended by the units.
  const { courseId } = req.params;
  try {
    let data = await Course.findById(courseId).populate("units"); //Find everything for me.
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  findAllCourses,
  findCourse,
  createCourse,
};
