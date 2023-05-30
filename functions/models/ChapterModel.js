const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChapterSchema = new Schema(
  {
    chapterNumber: { type: String, required: true, unique: true },
    chapterName: { type: String, required: true, uppercase: true },
    chapterDescription: { type: String, required: true },
    chapterLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  },
  {
    timestamps: true,
  }
);

const Chapter = mongoose.model("Chapter", ChapterSchema);

module.exports = Chapter;
