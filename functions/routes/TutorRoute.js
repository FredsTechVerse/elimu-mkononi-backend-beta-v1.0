const express = require("express");
const router = express.Router();

const {
  registerTutor,
  findAuthorizedTutor,
  confirmUserCredentials,
  confirmResetToken,
  findAllTutors,
  findTutorById,
  updateTutorInfo,
  deleteTutorById,
  updateTutorPassword,
} = require("../controllers/TutorControllers");

// TUTOR ROUTES
router.post("/", registerTutor);
router.post("/confirmation/:tutorID", confirmUserCredentials);
router.put("/password", updateTutorPassword);
router.get("/all-tutors", findAllTutors);
router.get("/", findAuthorizedTutor);
router.get("/:tutorID", findTutorById);
router.put("/:tutorID", updateTutorInfo);
router.post("/:tutorID", confirmResetToken);
router.delete("/:tutorID", deleteTutorById);

module.exports = router;
