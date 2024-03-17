const Tutor = require("../models/TutorModel");
const bcrypt = require("bcrypt");
const { handleError } = require("./ErrorHandling");
const { generateRandomString } = require("../controllers/Authentication");
const { sendEmail } = require("../controllers/EmailController");
const { sendMessage } = require("../controllers/MessageController");

const registerTutor = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const emailVerificationCode = generateRandomString(6);
    const contactVerificationCode = generateRandomString(6);
    const emailMessage = `Hello ${req.body.firstName.toUpperCase()},Tutor,${emailVerificationCode} is your email verification code.`;
    const message = `Hello ${req.body.firstName.toUpperCase()},Tutor,${contactVerificationCode} is your contact verification code.`;
    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
      emailVerificationCode,
      contactVerificationCode,
    };
    const newTutor = await Tutor.create(credentials);
    newTutor.save();
    sendMessage({
      recipients: [req.body.contact],
      message: message,
      role: "EM-202",
    });
    sendEmail({
      to: [req.body.email],
      subject: "EMAIL VERIFICATION CODE FOR TUTOR ACCOUNT ON ELIMU HUB",
      text: emailMessage,
      role: "EM-202",
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
    const userData = await Tutor.findById(tutorID).select("-password");
    let credentials = { isEmailVerified: false, isContactVerified: false };
    if (
      userData.contactVerificationCode === contactVerificationCode &&
      userData.emailVerificationCode === emailVerificationCode
    ) {
      credentials.isContactVerified = true;
      credentials.isEmailVerified = true;
      await Tutor.findByIdAndUpdate(tutorID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(200).json({ message: "Email and Contact Confirmed" });
    } else if (
      userData.contactVerificationCode === contactVerificationCode &&
      userData.emailVerificationCode !== emailVerificationCode
    ) {
      credentials.isContactVerified = true;
      credentials.isEmailVerified = false;
      await Tutor.findByIdAndUpdate(tutorID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(401).json({ message: "Email is invalid" });
    } else if (
      userData.contactVerificationCode !== contactVerificationCode &&
      userData.emailVerificationCode === emailVerificationCode
    ) {
      credentials.isContactVerified = false;
      credentials.isEmailVerified = true;
      await Tutor.findByIdAndUpdate(tutorID, credentials, {
        new: true,
        upsert: true,
      });
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
    const { userID: tutorID } = req?.user;
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
