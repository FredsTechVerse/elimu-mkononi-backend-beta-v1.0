const express = require("express");
const router = express.Router();

// IMPORT CONTROLLERS
//====================
const {
  createTokenModel,
  renewTokens,
  findStudentById,
  findAllStudents,
  registerStudent,
  deleteStudentById,
  findTutorById,
  findAllUsers,
  findAllTutors,
  registerTutor,
  deleteTutorById,
  findAdminById,
  findAllAdmins,
  registerAdmin,
  deleteAdminById,
  logInUser,
  logOutUser,
  verifyAccess,
} = require("../controllers/AuthController");

// AUTHORIZATION ROUTES
router.get("/verify-access", verifyAccess);
router.post("/create-token", createTokenModel);
router.post("/login", logInUser);
router.post("/refresh-token", renewTokens);
router.delete("/logout", logOutUser);
router.get("/all-users", findAllUsers);

// STUDENT ROUTES
router.get("/all-students", findAllStudents);
router.get("/student/:studentId", findStudentById);
router.post("/register-student", registerStudent);
router.delete("/student/:studentID", deleteStudentById);

// TUTOR ROUTES
router.get("/all-tutors", findAllTutors);
router.get("/tutor", findTutorById);
router.post("/register-tutor", registerTutor);
router.delete("/tutor/:tutorID", deleteTutorById);

// ADMIN ROUTES
router.get("/all-admins", findAllAdmins);
router.get("/admin", findAdminById);
router.post("/register-admin", registerAdmin);
router.delete("/admin/:adminID", deleteAdminById);

module.exports = router;
