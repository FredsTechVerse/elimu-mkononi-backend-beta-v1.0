const Lesson = require("../models/LessonModel");
const Chapter = require("../models/ChapterModel");
const { handleError } = require("./ErrorHandling");

const createLesson = async (req, res) => {
  try {
    console.log(`Lesson Data received : ${JSON.stringify(req.body)}`);
    let { chapterID, lessonNumber, lessonName, lessonUrl, thumbnails } =
      req.body;
    let lessonData = {
      lessonNumber,
      lessonName,
      lessonUrl,
      thumbnails,
    };
    console.log(
      `Thumbnails data to be sent to server ${JSON.stringify(thumbnails)}`
    );
    let newLesson = await Lesson.create(lessonData);
    newLesson.save();
    let { _id: lessonID } = newLesson;
    let chapterData = await Chapter.findByIdAndUpdate(
      chapterID,
      { $push: { chapterLessons: lessonID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (chapterData._doc.chapterLessons.includes(lessonID)) {
      res.status(201).send(newLesson);
    }
  } catch (err) {
    handleError(err);
  }
};
const findLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    let lessonData = await Lesson.findById(lessonId).populate([
      "lessonNotes,lessonResources",
    ]);
    res.json(lessonData);
  } catch (err) {
    handleError(err);
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { lessonID } = req.params;
    await Lesson.findByIdAndDelete(lessonID);
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err) {
    handleError(err);
  }
};

module.exports = { findLesson, createLesson, deleteLesson };
