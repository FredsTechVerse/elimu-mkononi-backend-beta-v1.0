const Tutor = require("../models/TutorModel");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { handleError } = require("./ErrorHandling");

const registerUser = async (req, res) => {
  try {
    console.log(
      `Register user request acknowledged ${JSON.stringify(req.body)}`
    );
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const credentials = {
      DOB: req.body.DOB,
      contact: req.body.contact,
      email: req.body.email,
      firstName: req.body.firstName,
      gender: req.body.gender,
      isInterestedToServe: req.body.isInterestedToServe,
      lastName: req.body.lastName,
      residence: req.body.residence,
      serviceGroup: req.body.serviceGroup,
    };
    const newUser = await User.create(credentials);
    newUser.save();
    console.log({ newUserData: newUser });
    res.sendStatus(201);
  } catch (err) {
    console.log(`Error while saving user ${JSON.stringify(err)}`);
    handleError(err, res);
  }
};

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
  registerUser,
  registerTutor,
  findAuthorizedTutor,
  findAllTutors,
  findTutorById,
  updateTutorInfo,
  deleteTutorById,
};
