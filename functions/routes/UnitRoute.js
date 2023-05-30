const express = require("express");
const router = express.Router();
// CONTROLLERS IMPORTATIONS.
//===========================
const {
  createUnit,
  getAllUnits,
  getUnit,
  getUnitWithChapters,
  getUnitWithLessons,
} = require("../controllers/UnitController");

// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
// When creating a lesson, we would like to save the lesson id to its respective chapter.
router.post("/new-unit", createUnit);

router.get("/:unitId", getUnitWithLessons);

router.get("/all-units", getAllUnits);

// EXPORTING A MODEL.
module.exports = router;
