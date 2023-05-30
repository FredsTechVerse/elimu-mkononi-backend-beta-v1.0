const express = require("express");
const router = express.Router();

// IMPORT CONTROLLERS
//====================
const {
  createTokenModel,
  renewTokens,
  authenticateToken,
  findStudentById,
  findAllStudents,
  registerStudent,
  deleteStudentById,
  findTutorById,
  findAllTutors,
  registerTutor,
  deleteTutorById,
  findAdminById,
  findAllAdmins,
  registerAdmin,
  deleteAdminById,
  logInUser,
  logOutUser,
} = require("../controllers/AuthController");

// STUDENT ROUTES
router.get("/all-students", findAllStudents);
router.get("/student/:studentId", findStudentById);
router.post("/register-student", registerStudent);
router.delete("/student", deleteStudentById);

// TUTOR ROUTES
router.get("/all-tutors", findAllTutors);
router.get("/tutor", authenticateToken, findTutorById);
router.post("/register-tutor", registerTutor);
router.delete("/tutor", deleteTutorById);

// ADMIN ROUTES
router.get("/all-admins", findAllAdmins);
router.get("/admin/:adminId", findAdminById);
router.post("/register-admin", registerAdmin);
router.delete("/admin", deleteAdminById);

// AUTHORIZATION ROUTES
router.post("/create-token", createTokenModel);
router.post("/login", logInUser);
router.post("/refresh-token", renewTokens);
router.delete("/logout", logOutUser);

module.exports = router;
