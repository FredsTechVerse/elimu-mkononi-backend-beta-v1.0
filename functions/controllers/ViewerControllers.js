const Viewer = require("../models/ViewerModel");
const bcrypt = require("bcrypt");
const { generateRandomString } = require("../controllers/Authentication");
const { sendEmail } = require("../controllers/EmailController");
const { sendMessage } = require("../controllers/MessageController");
const { handleError } = require("./ErrorHandling");
const registerViewer = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const emailVerificationCode = generateRandomString(6);
    const emailMessage = `Hello ${req.body.firstName.toUpperCase()},Student,${emailVerificationCode} is your email verification code.`;
    console.log(req.body);
    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      password: hashedPassword,
      emailVerificationCode,
    };
    const newStudent = await Viewer.create(credentials);
    newStudent.save();

    sendEmail({
      to: [req.body.email],
      subject: "EMAIL VERIFICATION CODE FOR VIEWER ACCOUNT",
      text: emailMessage,
      role: "EM-201",
    });
    res.status(201).send(newStudent);
  } catch (err) {
    handleError(err, res);
  }
};

const confirmResetToken = async (req, res) => {
  try {
    const { viewerID } = req.params;
    const { resetToken } = req.body;
    const studentData = await Viewer.findById(viewerID).select("-password");
    if (studentData?.resetToken.includes(resetToken)) {
      res.status(200).json(studentData);
    } else {
      res.status(401).json({ message: "The reset token is incorrect" });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const confirmUserCredentials = async (req, res) => {
  try {
    const { viewerID } = req.params;
    console.log("Confirming user credentials");
    console.log({ viewerID });
    const { emailVerification: emailVerificationCode } = req.body;
    const userData = await Viewer.findById(viewerID).select("-password");
    let credentials = { isEmailVerified: false };
    if (userData.emailVerificationCode === emailVerificationCode) {
      credentials.isEmailVerified = true;
      await Viewer.findByIdAndUpdate(viewerID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(200).json({ message: "Email Confirmed" });
    } else {
      credentials.isEmailVerified = false;
      await Viewer.findByIdAndUpdate(viewerID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(401).json({ message: "Email is invalid" });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const findAllViewers = async (req, res) => {
  try {
    const studentData = await Viewer.find({}).select("-password");
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err, res);
  }
};

const findAuthorizedViewer = async (req, res) => {
  try {
    const { userID: viewerID } = req.user;
    const studentData = await Viewer.findById(viewerID).select("-password");
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err, res);
  }
};

const findViewerById = async (req, res) => {
  try {
    const { viewerID } = req.params;
    const studentData = await Viewer.findById(viewerID).select("-password");
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateViewerInfo = async (req, res) => {
  try {
    const { viewerID } = req.params;
    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
    };
    await Viewer.findByIdAndUpdate(viewerID, credentials);
    res
      .status(202)
      .json({ message: "Student information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};

const updateViewerPassword = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const credentials = {
      password: hashedPassword,
    };
    await Viewer.findByIdAndUpdate(userID, credentials);
    res
      .status(202)
      .json({ message: "Tutor information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteViewerById = async (req, res) => {
  try {
    const { viewerID } = req.params;
    await Viewer.findByIdAndDelete(viewerID);
    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  registerViewer,
  findAuthorizedViewer,
  confirmUserCredentials,
  confirmResetToken,
  findAllViewers,
  findViewerById,
  updateViewerInfo,
  updateViewerPassword,
  deleteViewerById,
};
