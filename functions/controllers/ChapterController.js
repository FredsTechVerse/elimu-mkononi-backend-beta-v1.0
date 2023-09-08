const Chapter = require("../models/ChapterModel");
const Unit = require("../models/UnitModel");
const Resource = require("../models/ResourceModel");
const Lesson = require("../models/LessonModel");
const Notes = require("../models/NotesModel");
const { handleError } = require("./ErrorHandling");
const { deleteResourceFromS3Bucket } = require("./fileUploadController");
const { sendEmail } = require("./EmailController");
const createChapter = async (req, res) => {
  try {
    const { unitID, chapterNumber, chapterName, chapterDescription } = req.body;
    const chapterData = {
      unit: unitID,
      chapterNumber,
      chapterName,
      chapterDescription,
    };

    const newChapter = await Chapter.create(chapterData);
    newChapter.save();
    const { _id: chapterID } = newChapter;
    const unitData = await Unit.findByIdAndUpdate(
      unitID,
      { $push: { unitChapters: chapterID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (unitData._doc.unitChapters.includes(chapterID)) {
      res.status(201).json(newChapter);
    } else {
      sendEmail({
        to: [process.env.TROUBLESHOOTING_EMAIL_ACCOUNT],
        subject: " UNIT CHAPTER UPDATE ERROR",
        text: "Something went wrong while updating unit with chapterID",
      });
      res.status(500).json({
        message: "Something went wrong while updating unit with chapter data",
      });
    }
  } catch (err) {
    handleError(err, res);
  }
};
const aggregateChapter = async (req, res) => {
  try {
    const chapterCount = await Chapter.count();
    res.sendStatus(200);
  } catch (err) {
    handleError(err, res);
  }
};

const findAllChapters = async (req, res) => {
  try {
    const allChapters = await Chapter.find({});
    res.json(allChapters);
  } catch (err) {
    handleError(err, res);
  }
};

const populateChapterLessons = async (req, res) => {
  try {
    const chapterData = await Chapter.find({}).populate("ChapterLessons");
    res.json(chapterData);
  } catch (err) {
    handleError(err, res);
  }
};

const findChapter = async (req, res) => {
  const { chapterID } = req.params;
  try {
    const chapterData = await Chapter.findById(chapterID)
      .populate("chapterLessons")
      .populate("chapterResources");
    res.json(chapterData);
  } catch (err) {
    handleError(err, res);
  }
};
const updateChapter = async (req, res) => {
  try {
    const { chapterID } = req.params;
    const { chapterNumber, chapterName, chapterDescription } = req.body;
    const chapterData = {
      chapterNumber,
      chapterName,
      chapterDescription,
    };
    await Chapter.findByIdAndUpdate(chapterID, chapterData);
    res.status(202).send({ message: "Chapter updated successfully!" });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { chapterID } = req.params;
    const lessonsToDelete = await Lesson.find({
      chapter: chapterID,
    }).select("_id");
    const resourcesToDelete = await Resource.find({
      chapter: chapterID,
    }).select("_id resourceUrl");
    const notesToDelete = await Notes.find({
      lesson: { $in: lessonsToDelete },
    }).select("_id");

    await Chapter.deleteOne({ _id: chapterID });
    await Lesson.deleteMany({ _id: { $in: lessonsToDelete } });
    await Resource.deleteMany({
      _id: { $in: resourcesToDelete.map((resource) => resource._id) },
    });
    resourcesToDelete.map((resource) => {
      deleteResourceFromS3Bucket({ resourceID: resource.resourceUrl });
    });
    await Notes.deleteMany({ _id: { $in: notesToDelete } });

    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  aggregateChapter,
  createChapter,
  findChapter,
  findAllChapters,
  populateChapterLessons,
  updateChapter,
  deleteChapter,
};
