const express = require("express");
const router = express.Router();
if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

const {
  createNotes,
  updateNotes,
  deleteNotes,
  findNote,
} = require("../controllers/NotesController");

router.post("/", createNotes);
router.get("/:notesID", findNote);
router.put("/:notesID", updateNotes);
router.delete("/:notesID", deleteNotes);

module.exports = router;
