const Tutor = require("../models/TutorModel");
const bcrypt = require("bcrypt");
const { handleError } = require("./ErrorHandling");

const registerTutor = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    };
    const newTutor = await Tutor.create(credentials);
    newTutor.save();
    res.sendStatus(201);
  } catch (err) {
    handleError(err, res);
  }
};

const findAllTutors = async (req, res) => {
  try {
    const tutorData = await Tutor.find({}).select("-password");
    res.status(200).json(tutorData);
  } catch (err) {
    handleError(err, res);
  }
};

const findAuthorizedTutor = async (req, res) => {
  try {
    const { userID: tutorID } = req.user;
    const tutorData = await Tutor.findById(tutorID)
      .select("-password")
      .populate({
        path: "units",
        populate: "unitChapters",
      });
    res.status(200).json(tutorData);
  } catch (err) {
    handleError(err, res);
  }
};

const findTutorById = async (req, res) => {
  try {
    const { tutorID } = req.params;
    const tutorData = await Tutor.findById(tutorID)
      .select("-password")
      .populate({
        path: "units",
        populate: "unitChapters",
      });
    res.status(200).json(tutorData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateTutorInfo = async (req, res) => {
  try {
    const { tutorID } = req.params;
    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
    };
    await Tutor.findByIdAndUpdate(tutorID, credentials);
    res
      .status(202)
      .json({ message: "Tutor information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteTutorById = async (req, res) => {
  try {
    const { tutorID } = req.params;
    await Tutor.findByIdAndDelete(tutorID);
    res.status(200).json({
      message: "Tutor deleted successfully",
    });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  registerTutor,
  findAuthorizedTutor,
  findAllTutors,
  findTutorById,
  updateTutorInfo,
  deleteTutorById,
};
