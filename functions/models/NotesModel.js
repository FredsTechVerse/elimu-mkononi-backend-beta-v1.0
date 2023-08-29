const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema(
  {
    lesson: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Creating a model.
const NotesModel = mongoose.model("Note", NotesSchema);
module.exports = NotesModel;
