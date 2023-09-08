const Course = require("../models/CourseModel");
const Unit = require("../models/UnitModel");
const Chapter = require("../models/ChapterModel");
const Resource = require("../models/ResourceModel");
const Lesson = require("../models/LessonModel");
const Notes = require("../models/NotesModel");
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
    const coursesCount = await Course.find().select("courseTitle -_id");
    res.status(200).json({ coursesCount });
  } catch (err) {
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
    // STEP 1: FINDING THE ID'S
    //==========================
    const { courseID } = req.params;
    const courseToDelete = await Course.findOne({ _id: courseID }).select(
      "_id"
    );
    const unitsToDelete = await Unit.find({ course: courseID }).select("_id");
    const chaptersToDelete = await Chapter.find({
      unit: { $in: unitsToDelete },
    }).select("_id");
    const resourcesToDelete = await Resource.find({
      chapter: { $in: chaptersToDelete },
    }).select("_id");
    const lessonsToDelete = await Lesson.find({
      chapter: { $in: chaptersToDelete },
    }).select("_id");
    const notesToDelete = await Notes.find({
      lesson: { $in: lessonsToDelete },
    }).select("_id");
    console.log({
      courseToDelete,
      unitsToDelete,
      chaptersToDelete,
      resourcesToDelete,
      lessonsToDelete,
      notesToDelete,
    });

    // STEP 2 : DELETING THE RECORDS
    // =============================
    await Course.deleteOne({ _id: courseToDelete._id });
    await Unit.deleteMany({ _id: { $in: unitsToDelete } });
    await Chapter.deleteMany({ _id: { $in: chaptersToDelete } });
    await Resource.deleteMany({ _id: { $in: resourcesToDelete } });
    await Lesson.deleteMany({ _id: { $in: lessonsToDelete } });
    await Notes.deleteMany({ _id: { $in: notesToDelete } });

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
