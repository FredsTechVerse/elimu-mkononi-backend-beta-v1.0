// MODEL IMPORTATION
//===================
const Resource = require("../models/ResourceModel");

const createResource = async (req, res) => {
  try {
    console.log(`Incoming resource body ${req.body}`);
    let { resourceName, resourceUrl } = req.body;
    let resourceData = { resourceName, resourceUrl };
    console.log(`Resource data object ${resourceData}`);
    let newResource = await Resource.create(resourceData);
    newResource.save();
    res.sendStatus(201);
  } catch (err) {
    // DESTRUCTURING MONGODB ATLAS ERROR.
    if (err.code == 11000) {
      res.sendStatus(409);
    } else {
      console.log(JSON.stringify(err));
      let { _message, name } = err;
      let errorBody = { _message, name };
      res.status(400).json(errorBody);
    }
  }
};

const findAllResources = async (req, res) => {
  // All the data will already be appended by the units.
  try {
    let data = await Resource.find({}); //Find everything for me.
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
const findResource = async (req, res) => {
  // All the data will already be appended by the units.
  const { resourceId } = req.params;
  try {
    let data = await Resource.findById(resourceId);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  findAllResources,
  findResource,
  createResource,
};
