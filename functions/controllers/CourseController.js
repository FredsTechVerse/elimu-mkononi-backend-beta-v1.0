const Course = require("../models/CourseModel");
const { handleError } = require("./ErrorHandling");

const createCourse = async (req, res) => {
  try {
    const { courseTitle, courseImage } = req.body;
    const courseData = { courseTitle, courseImage };
    const newCourse = await Course.create(courseData);
    newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    handleError(err, res);
  }
};

const aggregateCourses = async (req, res) => {
  try {
    const coursesBreakdown = await Course.aggregate([
      { $group: { _id: "$courseTitle", courseCount: { $sum: 1 } } },
    ]);
    console.log(coursesBreakdown);
    res.sendStatus(200);
  } catch (err) {
    console.log(`Course aggregation error ${JSON.stringify(err)}`);
    handleError(err, res);
  }
};

const findAllCourses = async (req, res) => {
  try {
    const courseData = await Course.find({}).populate({
      path: "units",
      populate: {
        path: "unitChapters",
      },
    });
    res.json(courseData);
  } catch (err) {
    handleError(err, res);
  }
};
const findCourse = async (req, res) => {
  const { courseID } = req.params;
  try {
    const courseData = await Course.findById(courseID).populate("units");
    res.json(courseData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseID } = req.params;
    const { courseTitle, courseImage } = req.body;
    const courseData = { courseTitle, courseImage };
    await Course.findByIdAndUpdate(courseID, courseData);
    res.status(202).json({ message: "Course updated successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseID } = req.params;
    await Course.findByIdAndDelete(courseID);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  aggregateCourses,
  findAllCourses,
  findCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
