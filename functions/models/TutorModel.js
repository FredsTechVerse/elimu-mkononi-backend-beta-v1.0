const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creates a model for saving customer credentials to the database.
//==================================================================
const TutorSchema = new Schema(
  {
    firstName: { type: String, required: true, uppercase: true },
    surname: { type: String, required: true, uppercase: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, required: true, default: "active" },
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
    role: {
      type: String,
      required: true,
      uppercase: true,
      default: "EM-202",
    },
  },
  {
    timestamps: true,
  }
);

const Tutor = mongoose.model("Tutor", TutorSchema);

module.exports = Tutor;
