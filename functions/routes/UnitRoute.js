const express = require("express");
const router = express.Router();
// CONTROLLERS IMPORTATIONS.
//===========================
const {
  aggregateUnit,
  createUnit,
  getAllUnits,
  getUnitWithLessons,
  updateUnit,
  deleteUnit,
} = require("../controllers/UnitController");

router.post("/", createUnit);
router.get("/aggregated", aggregateUnit);
router.get("/all-units", getAllUnits);
router.get("/:unitID", getUnitWithLessons);
router.put("/:unitID", updateUnit);
router.delete("/:unitID", deleteUnit);

module.exports = router;
