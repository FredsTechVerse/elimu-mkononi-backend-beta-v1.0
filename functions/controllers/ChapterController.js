const Chapter = require("../models/ChapterModel");
const Unit = require("../models/UnitModel");
const { handleError } = require("./ErrorHandling");

const createChapter = async (req, res) => {
  try {
    const { unitID, chapterNumber, chapterName, chapterDescription } = req.body;
    const chapterData = {
      chapterNumber,
      chapterName,
      chapterDescription,
    };

    const newChapter = await Chapter.create(chapterData);
    newChapter.save();
    const { _id: chapterID } = newChapter;
    if (unitID !== null && unitID !== undefined) {
      const unitData = await Unit.findByIdAndUpdate(
        unitID,
        { $push: { unitChapters: chapterID } },
        { new: true, useFindAndModify: false, runValidation: true }
      );
      if (unitData._doc.unitChapters.includes(chapterID)) {
        res.status(201).json(newChapter);
      } else {
        res
          .status(500)
          .json({ message: "Something went wrong while updating Unit model" });
      }
    } else {
      res.status(404).json({ message: "Unit not found" });
    }
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
    const chapterData = await Chapter.findById(chapterID).populate(
      "chapterLessons"
    );
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
    await Chapter.findByIdAndDelete(chapterID);
    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  createChapter,
  findChapter,
  findAllChapters,
  populateChapterLessons,
  updateChapter,
  deleteChapter,
};
