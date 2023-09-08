const mongoose = require("mongoose");

const { Schema } = mongoose;

const UnitSchema = new Schema(
  {
    unitCode: { type: String, required: true, unique: true, uppercase: true },
    unitName: { type: String, required: true, uppercase: true },
    unitType: { type: String, required: true, default: "paid" },
    unitDescription: { type: String, required: true },
    unitChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
    tutor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tutor" }],
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Unit = mongoose.model("Unit", UnitSchema);

module.exports = Unit;
