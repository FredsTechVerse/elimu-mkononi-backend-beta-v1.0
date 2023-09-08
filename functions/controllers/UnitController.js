// MODEL IMPORTATION
//===================
const Unit = require("../models/UnitModel");
const Course = require("../models/CourseModel");
const Tutor = require("../models/TutorModel");
const Chapter = require("../models/ChapterModel");
const Resource = require("../models/ResourceModel");
const Lesson = require("../models/LessonModel");
const Notes = require("../models/NotesModel");
const { handleError } = require("./ErrorHandling");
const { deleteResourceFromS3Bucket } = require("./fileUploadController");
const { sendEmail } = require("./EmailController");

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
const createUnit = async (req, res) => {
  try {
    const { courseID, tutorID, unitCode, unitName, unitDescription } = req.body;
    const unitData = {
      course: courseID,
      unitCode,
      unitName,
      unitDescription,
      tutor: [tutorID],
    };

    const newUnit = await Unit.create(unitData);
    newUnit.save();
    const { _id: unitID } = newUnit; // Extracting ID from staved Lesson

    const courseData = await Course.findByIdAndUpdate(
      courseID,
      { $push: { units: unitID } }, //Adding to an array of elements.
      { new: true, useFindAndModify: false, runValidation: true } //Addition params for update validation.
    );
    const tutorData = await Tutor.findByIdAndUpdate(
      tutorID,
      { $push: { units: unitID } }, //Adding to an array of elements.
      { new: true, useFindAndModify: false, runValidation: true } //Addition params for update validation.
    );

    if (courseData.units.includes(unitID) && tutorData.units.includes(unitID)) {
      res.sendStatus(201);
    } else {
      sendEmail({
        to: [process.env.TROUBLESHOOTING_EMAIL_ACCOUNT],
        subject: "COURSE UNIT UPDATE ERROR",
        text: "Something went wrong while updating course with unitID",
      });
      res.status(500).json({
        message: "Something went wrong while updating course with unit data",
      });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const aggregateUnit = async (req, res) => {
  try {
    const unitData = await Unit.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseInformation",
        },
      },
      {
        $unwind: "$courseInformation",
      },
      {
        $group: {
          _id: "$courseInformation.courseTitle",
          unitCount: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send(unitData);
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
  try {
    const { unitID } = req.params;

    const chaptersToDelete = await Chapter.find({
      unit: unitID,
    }).select("_id");
    const lessonsToDelete = await Lesson.find({
      chapter: { $in: chaptersToDelete },
    }).select("_id");
    const resourcesToDelete = await Resource.find({
      chapter: { $in: chaptersToDelete },
    }).select("_id resourceUrl");
    const notesToDelete = await Notes.find({
      lesson: { $in: lessonsToDelete },
    }).select("_id");

    await Unit.deleteOne({ _id: unitID });
    await Chapter.deleteMany({ _id: { $in: chaptersToDelete } });
    await Lesson.deleteMany({ _id: { $in: lessonsToDelete } });
    await Resource.deleteMany({
      _id: { $in: resourcesToDelete.map((resource) => resource._id) },
    });
    resourcesToDelete.map((resource) => {
      deleteResourceFromS3Bucket({ resourceName: resource.resourceUrl });
    });
    await Notes.deleteMany({ _id: { $in: notesToDelete } });

    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  aggregateUnit,
  createUnit,
  getAllUnits,
  getUnit,
  getUnitWithChapters,
  getUnitWithLessons,
  updateUnit,
  deleteUnit,
};
