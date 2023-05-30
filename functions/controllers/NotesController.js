// MODEL IMPORTATION
const Notes = require("../models/NotesModel");
const Lesson = require("../models/LessonModel");

const createNotes = async (req, res) => {
  try {
    // Extracting the data from the request body.
    let { lessonNotes, lessonID } = req.body;
    console.log({ lessonNotes, lessonID });
    // Creating a new Notes object.
    let newNotes = await Notes.create({ content: lessonNotes });
    newNotes.save();
    console.log("Notes successfully created.");
    let { _id: notesID } = newNotes;
    // Pushing the notes ID to the lesson.
    let lessonData = await Lesson.findByIdAndUpdate(
      lessonID,
      { $set: { lessonNotes: notesID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );

    if (lessonData.lessonNotes.equals(notesID)) {
      console.log("Notes Data operation successfull.");
      res.sendStatus(201);
    }
  } catch (err) {
    if (err.code == 11000) {
      console.log(JSON.stringify(err));
      let errorBody = { message: "This notes already exists!" };
      res.status(400).json(errorBody);
    } else {
      console.log(err);
      res.status(400).json(err);
    }
  }
};

const findNote = async (req, res) => {
  const { notesID } = req.params;
  try {
    let data = await Notes.findById(notesID);
    console.log(data);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

// KEY DISCOVERY
//==============
/**
 * Callbacks and try catch to not mix.It is either we use the try catch without the callback or use the callback without the try catch.
 */
// VERSION_1(Using Callbacks)
//============================
// const updateNotes = async (req, res) => {
//   console.log(req.body);
//   // Extracting the data from the request body.
//   let { lessonNotes, notesID } = req.body;
//   //Updating the notes
//   Notes.findByIdAndUpdate(
//     notesID,
//     { $set: { content: lessonNotes } },
//     function (err, updatedNotes) {
//       if (err) {
//         console.log(err);
//         return res.status(400).json(err);
//       }
//       console.log(updatedNotes);
//       return res.status(202).json({ message: updatedNotes });
//     }
//   );
// };
// VERSION_2(Using try catch)
//============================
const updateNotes = async (req, res) => {
  try {
    // Extracting the data from the request body.
    let { lessonNotes, notesID } = req.body;

    //Updating the notes
    let updatedNotes = await Notes.findByIdAndUpdate(notesID, {
      $set: { content: lessonNotes },
    });

    console.log(updatedNotes);
    return res.status(202).json({ message: updatedNotes });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = { createNotes, updateNotes, findNote };
