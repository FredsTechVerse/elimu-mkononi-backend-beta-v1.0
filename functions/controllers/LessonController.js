const Lesson = require("../models/LessonModel");
const Chapter = require("../models/ChapterModel");
const { handleError } = require("./ErrorHandling");

const createLesson = async (req, res) => {
  try {
    const { chapterID, lessonNumber, lessonName, lessonUrl } = req.body;

    const lessonData = {
      chapter: chapterID,
      lessonNumber,
      lessonName,
      lessonUrl,
    };
    const newLesson = await Lesson.create(lessonData);
    newLesson.save();
    const { _id: lessonID } = newLesson;
    const chapterData = await Chapter.findByIdAndUpdate(
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

const aggregateLessons = async (req, res) => {
  try {
    const aggregatedLessons = await Lesson.aggregate([
      { $group: { _id: "$chapter", lessonCount: { $sum: 1 } } },
    ]);

    console.log(aggregatedLessons);
    res.sendStatus(200);
  } catch (err) {
    handleError(err, res);
  }
};
const findLesson = async (req, res) => {
  try {
    const { lessonID } = req.params;
    const lessonData = await Lesson.findById(lessonID).populate("lessonNotes");
    res.json(lessonData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateLesson = async (req, res) => {
  try {
    const { lessonID } = req.params;
    const { lessonNumber, lessonName, lessonUrl } = req.body;

    const lessonData = {
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

module.exports = {
  aggregateLessons,
  findLesson,
  createLesson,
  updateLesson,
  deleteLesson,
};
