const express = require("express");
const router = express.Router();

const {
  registerStudent,
  findAuthorizedStudent,
  confirmResetToken,
  findAllStudents,
  findStudentById,
  updateStudentInfo,
  deleteStudentById,
} = require("../controllers/StudentControllers");
router.post("/", registerStudent);
router.get("/", findAuthorizedStudent);
router.get("/all-students", findAllStudents);
router.get("/:studentID", findStudentById);
router.put("/:studentID", updateStudentInfo);
router.post("/:studentID", confirmResetToken);
router.delete("/:studentID", deleteStudentById);

module.exports = router;
