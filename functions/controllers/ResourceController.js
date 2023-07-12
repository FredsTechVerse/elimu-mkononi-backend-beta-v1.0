const Resource = require("../models/ResourceModel");
const Lesson = require("../models/LessonModel");
const { handleError } = require("./ErrorHandling");

const createResource = async (req, res) => {
  try {
    let { lessonID, resourceName, resourceUrl } = req.body;
    let resourceData = { resourceName, resourceUrl };
    let newResource = await Resource.create(resourceData);
    newResource.save();
    let { _id: resourceID } = newResource;
    let lessonData = await Lesson.findByIdAndUpdate(
      lessonID,
      { $set: { lessonNotes: resourceID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );

    if (lessonData.lessonNotes.equals(resourceID)) {
      res.status(201).send(newResource);
    }
  } catch (err) {
    handleError(err, res);
  }
};

const findAllResources = async (req, res) => {
  try {
    let data = await Resource.find({});
    res.json(data);
  } catch (err) {
    handleError(err, res);
  }
};
const findResource = async (req, res) => {
  const { resourceId } = req.params;
  try {
    let resourceData = await Resource.findById(resourceId);
    res.json(resourceData);
  } catch (err) {
    handleError(err, res);
  }
};

const deleteResource = async (req, res) => {
  try {
    const { resourceID } = req.params;
    await Resource.findByIdAndDelete(resourceID);
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
};
module.exports = {
  findAllResources,
  findResource,
  createResource,
  deleteResource,
};
