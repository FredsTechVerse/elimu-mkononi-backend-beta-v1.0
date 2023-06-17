// MODEL IMPORTATION
//===================
const Resource = require("../models/ResourceModel");
const Lesson = require("../models/LessonModel");

// ERROR HANDLING CONTROLLER
const { handleError } = require("./ErrorHandling");

const createResource = async (req, res) => {
  try {
    let { lessonID, resourceName, resourceUrl } = req.body;
    let resourceData = { resourceName, resourceUrl };
    let newResource = await Resource.create(resourceData);
    newResource.save();
    let { _id: resourceID } = newResource;
    // Pushing the notes ID to the lesson.
    let lessonData = await Lesson.findByIdAndUpdate(
      lessonID,
      { $set: { lessonNotes: resourceID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );

    if (lessonData.lessonNotes.equals(resourceID)) {
      res.status(201).send(newResource);
    }
  } catch (err) {
    handleError(err);
  }
};

const findAllResources = async (req, res) => {
  // All the data will already be appended by the units.
  try {
    let data = await Resource.find({}); //Find everything for me.
    res.json(data);
  } catch (err) {
    handleError(err);
  }
};
const findResource = async (req, res) => {
  // All the data will already be appended by the units.
  const { resourceId } = req.params;
  try {
    let data = await Resource.findById(resourceId);
    res.json(data);
  } catch (err) {
    handleError(err);
  }
};
module.exports = {
  findAllResources,
  findResource,
  createResource,
};
