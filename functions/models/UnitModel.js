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
  },
  {
    timestamps: true,
  }
);

const Unit = mongoose.model("Unit", UnitSchema);

module.exports = Unit;
