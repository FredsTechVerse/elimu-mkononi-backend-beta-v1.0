const Admin = require("../models/AdminModel");
const bcrypt = require("bcrypt");
const { generateRandomString } = require("../controllers/Authentication");
const { sendEmail } = require("../controllers/EmailController");
const { sendMessage } = require("../controllers/MessageController");
const { handleError } = require("./ErrorHandling");

const registerAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const emailVerificationCode = generateRandomString(6);
    const contactVerificationCode = generateRandomString(6);
    const emailMessage = `Hello ${req.body.firstName.toUpperCase()},Admin,${emailVerificationCode} is your email verification code.`;
    const message = `Hello ${req.body.firstName.toUpperCase()},Admin,${contactVerificationCode} is your contact verification code.`;

    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      emailVerificationCode,
      contactVerificationCode,
      password: hashedPassword,
    };

    // Generate reset token to be sent to email and as sms
    const newAdmin = await Admin.create(credentials);
    newAdmin.save();

    sendMessage({
      recipients: [req.body.contact],
      message: message,
      role: "EM-203",
    });

    sendEmail({
      to: [req.body.email],
      subject: "EMAIL VERIFICATION CODE FOR ADMIN ACCOUNT ON ELIMU HUB",
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
      contact: req.body.contact,
    };
    await Admin.findByIdAndUpdate(adminID, credentials);
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
    const {
      contactVerification: contactVerificationCode,
      emailVerification: emailVerificationCode,
    } = req.body;
    const userData = await Admin.findById(adminID).select("-password");
    let credentials = { isEmailVerified: false, isContactVerified: false };
    if (
      userData.contactVerificationCode === contactVerificationCode &&
      userData.emailVerificationCode === emailVerificationCode
    ) {
      credentials.isContactVerified = true;
      credentials.isEmailVerified = true;
      await Admin.findByIdAndUpdate(adminID, credentials, {
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
      await Admin.findByIdAndUpdate(adminID, credentials, {
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
      await Admin.findByIdAndUpdate(adminID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(401).json({ message: "Contact is invalid" });
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
    await Admin.findByIdAndUpdate(userID, credentials);
    res
      .status(202)
      .json({ message: "Admin information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};
const findAuthorizedAdmin = async (req, res) => {
  try {
    const { userID: adminID } = req?.user;
    const adminData = await Admin.findById(adminID).select("-password");
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};

const findAdminById = async (req, res) => {
  try {
    const { adminID } = req.params;
    const adminData = await Admin.findById(adminID).select("-password");
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};

const confirmResetToken = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { resetToken } = req.body;
    const adminData = await Admin.findById(adminID).select("-password");
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
    const adminData = await Admin.find({}).select("-password");
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    const { adminID } = req.params;
    await Admin.findByIdAndDelete(adminID);
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
