const mongoose = require("mongoose");
const { Schema } = mongoose;

const LessonSchema = new Schema(
  {
    lessonNumber: { type: String, required: true },
    lessonName: { type: String, required: true, uppercase: true },
    lessonUrl: { type: String, required: true },
    videoKind: { type: String, required: true },
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
const LessonModel = mongoose.model("Lesson", LessonSchema);
module.exports = LessonModel;
