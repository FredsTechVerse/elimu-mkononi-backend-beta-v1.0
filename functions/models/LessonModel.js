const mongoose = require("mongoose");
const { Schema } = mongoose;

const LessonSchema = new Schema(
  {
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
    lessonNumber: { type: String, required: true },
    lessonName: { type: String, required: true, uppercase: true },
    lessonUrl: { type: String, required: true },
    videoKind: { type: String, required: true, default: "youtube#video" },
    lessonNotes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  },
  {
    timestamps: true,
  }
);
const LessonModel = mongoose.model("Lesson", LessonSchema);
module.exports = LessonModel;
