const express = require("express");
const router = express.Router();
if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  createNotes,
  updateNotes,
  findNote,
} = require("../controllers/NotesController");

// ROUTES CONFIGURATION
//=====================
router.get("/:notesID", findNote);
router.post("/newNotes", createNotes);

router.put("/updateNotes", updateNotes);

// EXPORTING A MODEL.
module.exports = router;
