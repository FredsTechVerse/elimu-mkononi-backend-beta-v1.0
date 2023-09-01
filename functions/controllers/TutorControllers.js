const Tutor = require("../models/TutorModel");
const bcrypt = require("bcrypt");
const { handleError } = require("./ErrorHandling");
const { confirmUserRegistration } = require("../controllers/Communication");

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
    confirmUserRegistration({
      firstName: req.body.firstName,
      contact: req.body.contact,
      role: "tutor",
    });
    res.status(201).send(newTutor);
  } catch (err) {
    handleError(err, res);
  }
};

const confirmResetToken = async (req, res) => {
  try {
    const { tutorID } = req.params;
    const { resetToken } = req.body;
    const tutorData = await Tutor.findById(tutorID).select("-password");
    if (tutorData?.resetToken === resetToken) {
      res.status(200).json(tutorData);
    } else {
      res.status(401).json({ message: "The reset token is incorrect" });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const confirmUserCredentials = async (req, res) => {
  try {
    const { tutorID } = req.params;
    const {
      contactVerification: contactVerificationCode,
      emailVerification: emailVerificationCode,
    } = req.body;
    const tutorData = await Tutor.findById(tutorID).select("-password");

    if (
      tutorData.contactVerificationCode === contactVerificationCode &&
      tutorData.emailVerificationCode === emailVerificationCode
    ) {
      res.status(200).json({ message: "Email and Contact Confirmed" });
    } else if (
      tutorData.contactVerificationCode === contactVerificationCode &&
      tutorData.emailVerificationCode !== emailVerificationCode
    ) {
      res.status(401).json({ message: "Email is invalid" });
    } else if (
      tutorData.contactVerificationCode !== contactVerificationCode &&
      tutorData.emailVerificationCode === emailVerificationCode
    ) {
      res.status(401).json({ message: "Contact is invalid" });
    }
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

const updateTutorPassword = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const credentials = {
      password: hashedPassword,
    };
    await Tutor.findByIdAndUpdate(userID, credentials);
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
  confirmUserCredentials,
  confirmResetToken,
  findAllTutors,
  findTutorById,
  updateTutorInfo,
  updateTutorPassword,
  deleteTutorById,
};
