// MODEL IMPORTATION
//===================
const Unit = require("../models/UnitModel");
const Course = require("../models/CourseModel");
const Tutor = require("../models/TutorModel");

// ERROR HANDLING
const { handleError } = require("./ErrorHandling");

const getUnit = async (req, res) => {
  const { unitID } = req.params;

  try {
    const data = await Unit.findById(unitID);
    res.json(data);
  } catch (err) {
    handleError(err, res);
  }
};
const getUnitWithChapters = async (req, res) => {
  const { unitID } = req.params;

  try {
    const data = await Unit.findById(unitID).populate("unitChapters");
    res.json(data);
  } catch (err) {
    handleError(err, res);
  }
};

const getUnitWithLessons = async (req, res) => {
  const { unitID } = req.params;

  try {
    const data = await Unit.findById(unitID).populate({
      path: "unitChapters",
      populate: { path: "chapterLessons" },
    });
    res.json(data);
  } catch (err) {
    handleError(err, res);
  }
};

const getAllUnits = async (req, res) => {
  try {
    const unitsData = await Unit.find({});
    res.status(201).json(unitsData);
  } catch (err) {
    handleError(err, res);
  }
};
// Perfect Illustration of One to many relationship.
const createUnit = async (req, res) => {
  try {
    const { courseID, tutorID, unitCode, unitName, unitDescription } = req.body;
    const unitData = {
      unitCode,
      unitName,
      unitDescription,
      tutor: [tutorID],
    };

    const newUnit = await Unit.create(unitData);
    newUnit.save();
    const { _id: unitID } = newUnit; // Extracting ID from staved Lesson

    const courseData = await Course.findByIdAndUpdate(
      //Returns / saves the new document in play.
      courseID,
      { $push: { units: unitID } }, //Adding to an array of elements.
      { new: true, useFindAndModify: false, runValidation: true } //Addition params for update validation.
    );
    const tutorData = await Tutor.findByIdAndUpdate(
      //Returns / saves the new document in play.
      tutorID,
      { $push: { units: unitID } }, //Adding to an array of elements.
      { new: true, useFindAndModify: false, runValidation: true } //Addition params for update validation.
    );

    if (courseData.units.includes(unitID) && tutorData.units.includes(unitID)) {
      // We can safely say that the unit has been created.
      res.sendStatus(201);
    }
  } catch (err) {
    handleError(err, res);
  }
};

const updateUnit = async (req, res) => {
  try {
    const { unitID } = req.params;
    const { tutorID, unitCode, unitName, unitDescription } = req.body;
    const unitData = {
      unitCode,
      unitName,
      unitDescription,
      tutor: [tutorID],
    };
    await Unit.findByIdAndUpdate(unitID, unitData);
    res.status(202).json({ message: "Unit updated successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteUnit = async (req, res) => {
  const { unitID } = req.params;
  try {
    await Unit.findByIdAndDelete(unitID);
    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  createUnit,
  getAllUnits,
  getUnit,
  getUnitWithChapters,
  getUnitWithLessons,
  updateUnit,
  deleteUnit,
};
