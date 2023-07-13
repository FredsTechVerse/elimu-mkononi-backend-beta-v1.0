const Notes = require("../models/NotesModel");
const Lesson = require("../models/LessonModel");
const { handleError } = require("./ErrorHandling");

const createNotes = async (req, res) => {
  try {
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
      res.status(201).send(newNotes);
    }
  } catch (err) {
    handleError(err, res);
  }
};

const findNote = async (req, res) => {
  const { notesID } = req.params;
  try {
    let NoteData = await Notes.findById(notesID);
    res.json(NoteData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateNotes = async (req, res) => {
  try {
    let { lessonNotes, notesID } = req.body;
    let updatedNotes = await Notes.findByIdAndUpdate(notesID, {
      $set: { content: lessonNotes },
    });
    return res.status(202).json({ message: updatedNotes });
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