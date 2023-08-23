const express = require("express");
const router = express.Router();

const {
  registerTutor,
  findAuthorizedTutor,
  findAllTutors,
  findTutorById,
  updateTutorInfo,
  deleteTutorById,
} = require("../controllers/TutorControllers");

// TUTOR ROUTES
router.post("/", registerTutor);
router.get("/all-tutors", findAllTutors);
router.get("/", findAuthorizedTutor);
router.get("/:tutorID", findTutorById);
router.put("/:tutorID", updateTutorInfo);
router.delete("/:tutorID", deleteTutorById);

module.exports = router;
