const Lesson = require("../models/LessonModel");
const Chapter = require("../models/ChapterModel");
const { handleError } = require("./ErrorHandling");

const createLesson = async (req, res) => {
  try {
    let { chapterID, lessonNumber, lessonName, lessonUrl } = req.body;

    let lessonData = {
      lessonNumber,
      lessonName,
      lessonUrl,
    };
    let newLesson = await Lesson.create(lessonData);
    newLesson.save();
    let { _id: lessonID } = newLesson;
    let chapterData = await Chapter.findByIdAndUpdate(
      chapterID,
      { $push: { chapterLessons: lessonID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (chapterData?._doc?.chapterLessons?.includes(lessonID)) {
      res.status(201).json(newLesson);
    }
  } catch (err) {
    handleError(err, res);
  }
};
const findLesson = async (req, res) => {
  try {
    const { lessonID } = req.params;
    let lessonData = await Lesson.findById(lessonID).populate("lessonNotes");
    res.json(lessonData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateLesson = async (req, res) => {
  try {
    const { lessonID } = req.params;
    let { lessonNumber, lessonName, lessonUrl } = req.body;

    let lessonData = {
      lessonNumber,
      lessonName,
      lessonUrl,
    };
    await Lesson.findByIdAndUpdate(lessonID, lessonData);
    res.status(202).json({ message: "Lesson updated successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { lessonID } = req.params;

    await Lesson.findByIdAndDelete(lessonID);
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { findLesson, createLesson, updateLesson, deleteLesson };
