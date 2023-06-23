// MODEL IMPORTATION
//===================
const Lesson = require("../models/LessonModel");
const Chapter = require("../models/ChapterModel");

// ERROR HANDLING
const { handleError } = require("./ErrorHandling");

const createLesson = async (req, res) => {
  try {
    console.log(`Lesson Data : ${JSON.stringify(req.body)}`);
    let { chapterID, lessonNumber, lessonName, lessonUrl } = req.body;
    let lessonData = {
      lessonNumber,
      lessonName,
      lessonUrl,
    };
    //Creating our new lesson
    let newLesson = await Lesson.create(lessonData);
    newLesson.save();
    let { _id: lessonID } = newLesson; // Extracting ID from staved Lesson
    // Pushing the lesson ID to the chapter.
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
    let data = await Lesson.findById(lessonId).populate([
      "lessonNotes,lessonResources",
    ]);
    res.json(data);
  } catch (err) {
    handleError(err);
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    let deletedLesson = await User.findByIdAndDelete(lessonId);
    res.json(deletedLesson);
  } catch (err) {
    handleError(err);
  }
};

module.exports = { findLesson, createLesson, deleteLesson };
