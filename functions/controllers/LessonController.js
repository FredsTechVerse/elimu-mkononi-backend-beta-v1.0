// MODEL IMPORTATION
//===================
const Lesson = require("../models/LessonModel");
const Chapter = require("../models/ChapterModel");

// Perfect Illustration of One to many relationship.
const createLesson = async (req, res) => {
  try {
    let { chapterID, lessonNumber, lessonName, lessonUrl } = req.body;
    let lessonData = {
      lessonNumber,
      lessonName,
      lessonUrl,
    };

    console.log(
      `Lesson Data : ${JSON.stringify(lessonData)} for Chapter ${chapterID}}`
    );
    //Creating our new lesson
    let newLesson = await Lesson.create(lessonData);
    newLesson.save();
    console.log("Lesson Created");
    let { _id: lessonID } = newLesson; // Extracting ID from staved Lesson
    // Pushing the lesson ID to the chapter.
    let chapterData = await Chapter.findByIdAndUpdate(
      chapterID,
      { $push: { chapterLessons: lessonID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (chapterData._doc.chapterLessons.includes(lessonID)) {
      console.log("Lesson Data operation successfull.");
      res.sendStatus(201);
    }
  } catch (err) {
    if (err.code == 11000) {
      console.console.log(JSON.stringify(err));
      let errorBody = { message: "This lesson already exists!" };
      res.status(400).json(errorBody);
    } else {
      console.log(err);
      res.status(400).json(err);
    }
  }
};
const findLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    let data = await Lesson.findById(lessonId).populate([
      "lessonNotes,lessonResources",
    ]);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    let deletedLesson = await User.findByIdAndDelete(
      "603e3fc4d4c6e11fb8b4c1de"
    );
    console.log(deletedLesson);
    res.json(deletedLesson);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = { findLesson, createLesson };
