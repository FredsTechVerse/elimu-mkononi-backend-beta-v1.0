const Resource = require("../models/ResourceModel");
const Chapter = require("../models/ChapterModel");
const { handleError } = require("./ErrorHandling");

const createResource = async (req, res) => {
  try {
    let { chapterID, resourceName, resourceUrl } = req.body;
    let resourceData = { resourceName, resourceUrl };
    let newResource = await Resource.create(resourceData);
    newResource.save();
    let { _id: resourceID } = newResource;
    let chapterData = await Chapter.findByIdAndUpdate(
      chapterID,
      { $push: { chapterResources: resourceID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );

    if (chapterData?._doc?.chapterResources?.includes(resourceID)) {
      res.status(201).json(newResource);
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
  const { resourceID } = req.params;
  try {
    let resourceData = await Resource.findById(resourceID);
    res.json(resourceData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateResource = async (req, res) => {
  try {
    const { resourceID } = req.params;
    let { resourceName, resourceUrl } = req.body;
    let resourceData = { resourceName, resourceUrl };
    await Resource.findByIdAndUpdate(resourceID, resourceData);
    res.status(202).json({ message: "Resource updated successfully" });
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
  updateResource,
  deleteResource,
};
