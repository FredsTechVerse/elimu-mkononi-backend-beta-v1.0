// MODEL IMPORTATION
//===================
const Chapter = require("../models/ChapterModel");
const Unit = require("../models/UnitModel");
const createChapter = async (req, res) => {
  try {
    console.log(`New Request. ${JSON.stringify(req.body)}`);
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
        res.sendStatus(201);
      } else {
        res
          .status(500)
          .send({ message: "Something went wrong while updating Unit model" });
      }
    } else {
      res.status(400).json({ message: "Chapter not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const findAllChapters = async (req, res) => {
  try {
    let allChapters = await Chapter.find({});
    res.json(allChapters);
  } catch (error) {
    res.status(500).send(error);
  }
};

const populateChapterLessons = async (req, res) => {
  try {
    let data = await Chapter.find({}).populate("ChapterLessons");
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

const findChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    let data = await Chapter.findById(chapterId).populate("chapterLessons");
    console.log("Requested Chapter Data");
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createChapter,
  findChapter,
  findAllChapters,
  populateChapterLessons,
};
