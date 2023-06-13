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
    console.log("Requested unit data");
    console.log(data);
    res.json(data);
  } catch (err) {
    handleError(err);
  }
};
const getUnitWithChapters = async (req, res) => {
  const { unitId } = req.params;

  try {
    let data = await Unit.findById(unitId).populate("unitChapters");
    console.log("Requested unit data");
    console.log(data);
    res.json(data);
  } catch (err) {
    handleError(err);
  }
};

const getUnitWithLessons = async (req, res) => {
  const { unitId } = req.params;

  try {
    let data = await Unit.findById(unitId).populate({
      path: "unitChapters",
      // Populating the lessons array for every chapter.
      populate: { path: "chapterLessons" },
    });
    console.log("Requested unit data");
    res.json(data);
  } catch (err) {
    handleError(err);
  }
};

const getAllUnits = async (req, res) => {
  try {
    const unitsData = await Unit.find({});
    res.status(201).json(unitsData);
  } catch (err) {
    handleError(err);
  }
};
// Perfect Illustration of One to many relationship.
const createUnit = async (req, res) => {
  try {
    console.log(req.body);
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
    console.log(unitData);
    let newUnit = await Unit.create(unitData);
    console.log(newUnit);
    newUnit.save();
    let { _id: unitID } = newUnit; // Extracting ID from staved Lesson

    let courseData = await Course.findByIdAndUpdate(
      //Returns / saves the new document in play.
      courseID,
      { $push: { units: unitID } }, //Adding to an array of elements.
      { new: true, useFindAndModify: false, runValidation: true } //Addition params for update validation.
    );
    console.log(courseData);
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
    handleError(err);
  }
};

module.exports = {
  createUnit,
  getAllUnits,
  getUnit,
  getUnitWithChapters,
  getUnitWithLessons,
};
