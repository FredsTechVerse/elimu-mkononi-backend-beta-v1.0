const Notes = require("../models/NotesModel");
const Lesson = require("../models/LessonModel");
const { handleError } = require("./ErrorHandling");

const createNotes = async (req, res) => {
  try {
    console.log(
      `Creating notes from the notes body : ${JSON.stringify(req.body)}`
    );
    let { lessonNotes, lessonID } = req.body;
    let newNotes = await Notes.create({ content: lessonNotes });
    newNotes.save();
    let { _id: notesID } = newNotes;
    let lessonData = await Lesson.findByIdAndUpdate(
      lessonID,
      { $set: { lessonNotes: notesID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );

    if (lessonData.lessonNotes.equals(notesID)) {
      res.status(201).json(newNotes);
    }
  } catch (err) {
    handleError(err, res);
  }
};

const findNote = async (req, res) => {
  try {
    const { notesID } = req.params;

    let noteData = await Notes.findById(notesID);
    console.log(
      `Here are the notes I have found ${JSON.stringify(
        noteData
      )} for the noteID ; ${notesID}`
    );
    res.json(noteData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateNotes = async (req, res) => {
  try {
    let { lessonNotes, notesID } = req.body;
    console.log(`We wanna update our notes to ${JSON.stringify(lessonNotes)}`);
    let updatedNotes = await Notes.findByIdAndUpdate(notesID, {
      $set: { content: lessonNotes },
    });
    return res.status(202).json(updatedNotes);
  } catch (err) {
    handleError(err, res);
  }
};

const deleteNotes = async (req, res) => {
  try {
    const { noteID } = req.params;
    await Notes.findByIdAndDelete(noteID);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { createNotes, updateNotes, findNote, deleteNotes };
