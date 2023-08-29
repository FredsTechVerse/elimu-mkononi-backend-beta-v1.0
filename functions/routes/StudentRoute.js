const express = require("express");
const router = express.Router();

const {
  aggregateStudents,
  registerStudent,
  findAuthorizedStudent,
  findAllStudents,
  findStudentById,
  updateStudentInfo,
  deleteStudentById,
} = require("../controllers/StudentControllers");
router.post("/", registerStudent);
router.get("/", findAuthorizedStudent);
router.get("/all-students", findAllStudents);
router.get("/aggregate", aggregateStudents);
router.get("/:studentID", findStudentById);
router.put("/:studentID", updateStudentInfo);
router.delete("/:studentID", deleteStudentById);

module.exports = router;
