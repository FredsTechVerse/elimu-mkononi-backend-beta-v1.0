// MODEL IMPORTATION
const Notes = require("../models/NotesModel");
const Lesson = require("../models/LessonModel");

// ERROR HANDLING
const { handleError } = require("./ErrorHandling");

const createNotes = async (req, res) => {
  try {
    console.log(`Creating notes : ${JSON.stringify(req.body)}`);
    // Extracting the data from the request body.
    let { lessonNotes, lessonID } = req.body;
    // Creating a new Notes object.
    let newNotes = await Notes.create({ content: lessonNotes });
    newNotes.save();
    let { _id: notesID } = newNotes;
    // Pushing the notes ID to the lesson.
    let lessonData = await Lesson.findByIdAndUpdate(
      lessonID,
      { $set: { lessonNotes: notesID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );

    if (lessonData.lessonNotes.equals(notesID)) {
      res.status(201).send(newNotes);
    }
  } catch (err) {
    handleError(err);
  }
};

const findNote = async (req, res) => {
  const { notesID } = req.params;
  try {
    let data = await Notes.findById(notesID);
    res.json(data);
  } catch (err) {
    handleError(err);
  }
};

const updateNotes = async (req, res) => {
  try {
    // Extracting the data from the request body.
    let { lessonNotes, notesID } = req.body;

    //Updating the notes
    let updatedNotes = await Notes.findByIdAndUpdate(notesID, {
      $set: { content: lessonNotes },
    });
    return res.status(202).json({ message: updatedNotes });
  } catch (err) {
    handleError(err);
  }
};

module.exports = { createNotes, updateNotes, findNote };
