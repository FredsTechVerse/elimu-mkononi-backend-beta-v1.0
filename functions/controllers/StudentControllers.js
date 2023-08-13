const Student = require("../models/StudentModel");
const { handleError } = require("./ErrorHandling");
const registerStudent = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    };
    const newStudent = await Student.create(credentials);
    newStudent.save();
    res
      .status(201)
      .json({ message: "Student has been registered successfully." });
  } catch (err) {
    handleError(err, res);
  }
};

const findAllStudents = async (req, res) => {
  try {
    const studentData = await Student.find({});
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err, res);
  }
};

const findStudentById = async (req, res) => {
  try {
    const { studentID } = req.params;
    const studentData = await Student.findById(studentID);
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
      .send(202)
      .json({ message: "Student information has been successfully updated" });
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
  findAllStudents,
  findStudentById,
  updateStudentInfo,
  deleteStudentById,
};
