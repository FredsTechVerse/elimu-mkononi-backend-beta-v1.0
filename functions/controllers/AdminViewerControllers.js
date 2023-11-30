const AdminViewer = require("../models/AdminViewerModel");
const bcrypt = require("bcrypt");
const { generateRandomString } = require("../controllers/Authentication");
const { sendEmail } = require("../controllers/EmailController");
const { sendMessage } = require("../controllers/MessageController");
const { handleError } = require("./ErrorHandling");

const registerAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const emailVerificationCode = generateRandomString(6);
    const emailMessage = `Hello ${req.body.firstName.toUpperCase()},Admin,${emailVerificationCode} is your email verification code.`;

    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      emailVerificationCode,
      password: hashedPassword,
    };

    // Generate reset token to be sent to email and as sms
    const newAdmin = await AdminViewer.create(credentials);
    newAdmin.save();

    sendEmail({
      to: [req.body.email],
      subject: "EMAIL VERIFICATION CODE FOR ADMIN ACCOUNT",
      text: emailMessage,
      role: "EM-203",
    });
    res.status(201).send(newAdmin);
  } catch (err) {
    handleError(err, res);
  }
};

const updateAdminInfo = async (req, res) => {
  try {
    const { adminID } = req.params;
    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
    };
    await AdminViewer.findByIdAndUpdate(adminID, credentials);
    res
      .status(202)
      .json({ message: "Admin information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};

const confirmUserCredentials = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { emailVerification: emailVerificationCode } = req.body;
    const userData = await AdminViewer.findById(adminID).select("-password");
    let credentials = { isEmailVerified: false };
    if (userData.emailVerificationCode === emailVerificationCode) {
      credentials.isEmailVerified = true;
      await AdminViewer.findByIdAndUpdate(adminID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(200).json({ message: "Email Confirmed" });
    } else {
      credentials.isEmailVerified = false;
      await AdminViewer.findByIdAndUpdate(adminID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(401).json({ message: "Email is invalid" });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const credentials = {
      password: hashedPassword,
    };
    await AdminViewer.findByIdAndUpdate(userID, credentials);
    res
      .status(202)
      .json({ message: "Admin information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};
const findAuthorizedAdmin = async (req, res) => {
  try {
    const { userID: adminID } = req.user;
    const adminData = await AdminViewer.findById(adminID).select("-password");
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};

const findAdminById = async (req, res) => {
  try {
    const { adminID } = req.params;
    const adminData = await AdminViewer.findById(adminID).select("-password");
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};

const confirmResetToken = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { resetToken } = req.body;
    const adminData = await AdminViewer.findById(adminID).select("-password");
    if (adminData?.resetToken.includes(resetToken)) {
      res.status(200).json(adminData);
    } else {
      res.status(401).json({ message: "The reset token is incorrect" });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const findAllAdmins = async (req, res) => {
  try {
    const adminData = await AdminViewer.find({}).select("-password");
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    const { adminID } = req.params;
    await AdminViewer.findByIdAndDelete(adminID);
    res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  registerAdmin,
  findAuthorizedAdmin,
  confirmUserCredentials,
  confirmResetToken,
  findAdminById,
  findAllAdmins,
  updateAdminInfo,
  updateAdminPassword,
  deleteAdminById,
};
