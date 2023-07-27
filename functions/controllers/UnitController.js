// MODEL IMPORTATION
//===================
const Unit = require("../models/UnitModel");
const Course = require("../models/CourseModel");
const Tutor = require("../models/TutorModel");

// ERROR HANDLING
const { handleError } = require("./ErrorHandling");

const getUnit = async (req, res) => {
  const { unitId } = req.params;

  try {
    let data = await Unit.findById(unitId);
    res.json(data);
  } catch (err) {
    handleError(err, res);
  }
};
const getUnitWithChapters = async (req, res) => {
  const { unitId } = req.params;

  try {
    let data = await Unit.findById(unitId).populate("unitChapters");
    res.json(data);
  } catch (err) {
    handleError(err, res);
  }
};

const getUnitWithLessons = async (req, res) => {
  const { unitId } = req.params;

  try {
    let data = await Unit.findById(unitId).populate({
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
    let {
      courseID,
      tutorId: tutorID,
      unitCode,
      unitName,
      unitDescription,
    } = req.body;
    let unitData = {
      unitCode,
      unitName,
      unitDescription,
      tutor: [tutorID],
    };

    let newUnit = await Unit.create(unitData);
    newUnit.save();
    let { _id: unitID } = newUnit; // Extracting ID from staved Lesson

    let courseData = await Course.findByIdAndUpdate(
      //Returns / saves the new document in play.
      courseID,
      { $push: { units: unitID } }, //Adding to an array of elements.
      { new: true, useFindAndModify: false, runValidation: true } //Addition params for update validation.
    );
    let tutorData = await Tutor.findByIdAndUpdate(
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
  deleteUnit,
};
