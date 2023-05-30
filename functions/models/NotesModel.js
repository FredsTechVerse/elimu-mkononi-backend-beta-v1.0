const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema(
  {
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Creating a model.
const NotesModel = mongoose.model("Note", NotesSchema);
// Exporting the Model
module.exports = NotesModel;
