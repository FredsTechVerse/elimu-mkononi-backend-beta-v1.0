const express = require("express");
const router = express.Router();

const {
  registerStudent,
  findAuthorizedStudent,
  updateStudentPassword,
  confirmUserCredentials,
  confirmResetToken,
  findAllStudents,
  findStudentById,
  updateStudentInfo,
  deleteStudentById,
} = require("../controllers/StudentControllers");
router.post("/", registerStudent);
router.post("/confirmation/:studentID", confirmUserCredentials);
router.get("/", findAuthorizedStudent);
router.put("/password", updateStudentPassword);
router.get("/all-students", findAllStudents);
router.get("/:studentID", findStudentById);
router.put("/:studentID", updateStudentInfo);
router.post("/:studentID", confirmResetToken);
router.delete("/:studentID", deleteStudentById);

module.exports = router;
