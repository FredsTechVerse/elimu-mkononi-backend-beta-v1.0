// MODEL IMPORTATION
//===================
const Unit = require("../models/UnitModel");
const Course = require("../models/CourseModel");
const Tutor = require("../models/TutorModel");
const getUnit = async (req, res) => {
  const { unitId } = req.params;

  try {
    let data = await Unit.findById(unitId);
    console.log("Requested unit data");
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getUnitWithChapters = async (req, res) => {
  const { unitId } = req.params;

  try {
    let data = await Unit.findById(unitId).populate("unitChapters");
    console.log("Requested unit data");
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
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
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllUnits = async (req, res) => {
  try {
    const unitsData = await Unit.find({});
    res.status(201).json(unitsData);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Perfect Illustration of One to many relationship.
const createUnit = async (req, res) => {
  try {
    console.log(req.body);
    let {
      courseId,
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
      courseId,
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
    if (err.code == 11000) {
      console.log(JSON.stringify(err));
      let errorBody = { message: "This unit already exists!" };
      res.status(400).json(errorBody);
    } else {
      console.log(err);
      let { _message, name } = err;
      let errorBody = { _message, name };
      res.status(400).json(errorBody);
    }
  }
};

module.exports = {
  createUnit,
  getAllUnits,
  getUnit,
  getUnitWithChapters,
  getUnitWithLessons,
};
