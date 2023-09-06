const Student = require("../models/StudentModel");
const bcrypt = require("bcrypt");
const { confirmUserRegistration } = require("../controllers/Communication");
const { generateRandomString } = require("../controllers/Authentication");
const { sendEmail } = require("../controllers/EmailController");
const { handleError } = require("./ErrorHandling");
const registerStudent = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const emailVerificationCode = generateRandomString(6);
    const contactVerificationCode = generateRandomString(6);

    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
      emailVerificationCode,
      contactVerificationCode,
    };
    const newStudent = await Student.create(credentials);
    newStudent.save();

    confirmUserRegistration({
      firstName: req.body.firstName.toUpperCase(),
      contact: req.body.contact,
      role: "STUDENT",
      contactVerificationCode,
    });
    const message = `Hello ${req.body.firstName.toUpperCase()},${emailVerificationCode} is your email verification code.`;
    sendEmail({
      to: [req.body.email],
      subject: "EMAIL VERIFICATION CODE FOR STUDENT ACCOUNT ON ELIMU HUB",
      text: message,
    });
    res.status(201).send(newStudent);
  } catch (err) {
    handleError(err, res);
  }
};

const confirmResetToken = async (req, res) => {
  try {
    const { studentID } = req.params;
    const { resetToken } = req.body;
    const studentData = await Student.findById(studentID).select("-password");
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
    const { studentID } = req.params;
    const {
      contactVerification: contactVerificationCode,
      emailVerification: emailVerificationCode,
    } = req.body;
    const tutorData = await Student.findById(studentID).select("-password");
    let report = { isEmailVerified: false, isContactVerified: false };
    if (
      tutorData.contactVerificationCode === contactVerificationCode &&
      tutorData.emailVerificationCode === emailVerificationCode
    ) {
      report.isContactVerified = true;
      report.isEmailVerified = true;
      await Student.findByIdAndUpdate(studentID, report, {
        new: true,
        upsert: true,
      });
      res.status(200).json({ message: "Email and Contact Confirmed" });
    } else if (
      tutorData.contactVerificationCode === contactVerificationCode &&
      tutorData.emailVerificationCode !== emailVerificationCode
    ) {
      report.isContactVerified = true;
      report.isEmailVerified = false;
      await Student.findByIdAndUpdate(studentID, report, {
        new: true,
        upsert: true,
      });
      res.status(401).json({ message: "Email is invalid" });
    } else if (
      tutorData.contactVerificationCode !== contactVerificationCode &&
      tutorData.emailVerificationCode === emailVerificationCode
    ) {
      report.isContactVerified = false;
      report.isEmailVerified = true;
      await Student.findByIdAndUpdate(studentID, report, {
        new: true,
        upsert: true,
      });
      res.status(401).json({ message: "Contact is invalid" });
    }
  } catch (err) {
    handleError(err, res);
  }
};

const findAllStudents = async (req, res) => {
  try {
    const studentData = await Student.find({}).select("-password");
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err, res);
  }
};

const findAuthorizedStudent = async (req, res) => {
  try {
    const { userID: studentID } = req.user;
    const studentData = await Student.findById(studentID).select("-password");
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err, res);
  }
};

const findStudentById = async (req, res) => {
  try {
    const { studentID } = req.params;
    const studentData = await Student.findById(studentID).select("-password");
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err, res);
  }
};

const updateStudentInfo = async (req, res) => {
  try {
    const { studentID } = req.params;
    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
    };
    await Student.findByIdAndUpdate(studentID, credentials);
    res
      .status(202)
      .json({ message: "Student information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};

const updateStudentPassword = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const credentials = {
      password: hashedPassword,
    };
    await Student.findByIdAndUpdate(userID, credentials);
    res
      .status(202)
      .json({ message: "Tutor information has been successfully updated" });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteStudentById = async (req, res) => {
  try {
    const { studentID } = req.params;
    await Student.findByIdAndDelete(studentID);
    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  registerStudent,
  findAuthorizedStudent,
  confirmUserCredentials,
  confirmResetToken,
  findAllStudents,
  findStudentById,
  updateStudentInfo,
  updateStudentPassword,
  deleteStudentById,
};
