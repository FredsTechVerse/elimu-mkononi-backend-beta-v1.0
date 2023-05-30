const mongoose = require("mongoose");
const { Schema } = mongoose;

const LessonSchema = new Schema(
  {
    lessonNumber: { type: String, required: true },
    lessonName: { type: String, required: true, uppercase: true },
    lessonUrl: { type: String, required: true },
    lessonNotes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
    lessonResources: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    ],
  },
  {
    timestamps: true,
  }
);

// Creating a model.
const LessonModel = mongoose.model("Lesson", LessonSchema);
// Exporting the Model
module.exports = LessonModel;
