const Notes = require("../models/NotesModel");
const Lesson = require("../models/LessonModel");
const { handleError } = require("./ErrorHandling");

const createNotes = async (req, res) => {
  try {
    const { lessonNotes, lessonID } = req.body;
    const newNotes = await Notes.create({
      content: lessonNotes,
      lesson: lessonID,
    });
    newNotes.save();
    const { _id: notesID } = newNotes;
    const lessonData = await Lesson.findByIdAndUpdate(
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

    const noteData = await Notes.findById(notesID);

    res.json(noteData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateNotes = async (req, res) => {
  try {
    const { notesID } = req.params;
    const { lessonNotes } = req.body;
    const lessonData = { content: lessonNotes };
    await Notes.findByIdAndUpdate(notesID, lessonData);
    return res.status(202).json({ message: "Notes updated successfully" });
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

module.exports = { createNotes, findNote, updateNotes, deleteNotes };
