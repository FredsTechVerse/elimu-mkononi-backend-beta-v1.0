const Chapter = require("../models/ChapterModel");
const Unit = require("../models/UnitModel");
const { handleError } = require("./ErrorHandling");

const createChapter = async (req, res) => {
  try {
    let { unitID, chapterNumber, chapterName, chapterDescription } = req.body;
    let chapterData = {
      chapterNumber,
      chapterName,
      chapterDescription,
    };
    let newChapter = await Chapter.create(chapterData);
    newChapter.save();
    let { _id: chapterID } = newChapter;
    if (unitID !== null && unitID !== undefined) {
      let unitData = await Unit.findByIdAndUpdate(
        unitID,
        { $push: { unitChapters: chapterID } },
        { new: true, useFindAndModify: false, runValidation: true }
      );
      if (unitData._doc.unitChapters.includes(chapterID)) {
        res.status(201).json(newChapter);
      } else {
        res
          .status(500)
          .send({ message: "Something went wrong while updating Unit model" });
      }
    } else {
      res.status(404).json({ message: "Unit not found" });
    }
  } catch (err) {
    handleError(err);
  }
};

const findAllChapters = async (req, res) => {
  try {
    let allChapters = await Chapter.find({});
    res.json(allChapters);
  } catch (err) {
    handleError(err);
  }
};

const populateChapterLessons = async (req, res) => {
  try {
    let chapterData = await Chapter.find({}).populate("ChapterLessons");
    res.json(chapterData);
  } catch (err) {
    handleError(err);
  }
};

const findChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    let chapterData = await Chapter.findById(chapterId).populate(
      "chapterLessons"
    );
    res.json(chapterData);
  } catch (err) {
    handleError(err);
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { chapterID } = req.params;
    await Chapter.findByIdAndDelete(chapterID);
    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (err) {
    handleError(err);
  }
};

module.exports = {
  createChapter,
  findChapter,
  findAllChapters,
  populateChapterLessons,
  deleteChapter,
};
