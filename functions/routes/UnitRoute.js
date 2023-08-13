const express = require("express");
const router = express.Router();
// CONTROLLERS IMPORTATIONS.
//===========================
const {
  createUnit,
  getAllUnits,
  getUnitWithLessons,
  updateUnit,
  deleteUnit,
} = require("../controllers/UnitController");

router.post("/", createUnit);
router.get("/:unitID", getUnitWithLessons);
router.get("/all-units", getAllUnits);
router.put("/:unitID", updateUnit);
router.delete("/:unitID", deleteUnit);

module.exports = router;
