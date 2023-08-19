const express = require("express");
const router = express.Router();

// IMPORT CONTROLLERS
//====================
const {
  logInUser,
  logOutUser,
  findAllUsers,
} = require("../controllers/Authentication");

const {
  verifyAccess,
  createTokenModel,
  renewTokens,
} = require("../controllers/Authorization");

const {
  registerAdmin,
  findAuthorizedAdmin,
  findAdminById,
  findAllAdmins,
  updateAdminInfo,
  deleteAdminById,
} = require("../controllers/AdminControllers");

const {
  registerTutor,
  findAuthorizedTutor,
  findAllTutors,
  findTutorById,
  updateTutorInfo,
  deleteTutorById,
} = require("../controllers/TutorControllers");

const {
  registerStudent,
  findAuthorizedStudent,
  findAllStudents,
  findStudentById,
  updateStudentInfo,
  deleteStudentById,
} = require("../controllers/StudentControllers");

// AUTHORIZATION ROUTES
router.post("/create-token", createTokenModel);
router.post("/login", logInUser);
router.post("/refresh-token", renewTokens);
router.get("/verify-access", verifyAccess);
router.get("/all-users", findAllUsers);
router.delete("/logout", logOutUser);

// STUDENT ROUTES
router.post("/student", registerStudent);
router.get("/student", findAuthorizedStudent);
router.get("/all-students", findAllStudents);
router.get("/student/:studentID", findStudentById);
router.put("/student/:studentID", updateStudentInfo);
router.delete("/student/:studentID", deleteStudentById);

// TUTOR ROUTES
router.post("/tutor", registerTutor);
router.get("/all-tutors", findAllTutors);
router.get("/tutor", findAuthorizedTutor);
router.get("/tutor/:tutorID", findTutorById);
router.put("/tutor/:tutorID", updateTutorInfo);
router.delete("/tutor/:tutorID", deleteTutorById);

// ADMIN ROUTES
router.post("/admin", registerAdmin);
router.get("/admin", findAuthorizedAdmin);
router.get("/all-admins", findAllAdmins);
router.get("/admin/:adminID", findAdminById);
router.put("/admin/:adminID", updateAdminInfo);
router.delete("/admin/:adminID", deleteAdminById);

module.exports = router;
