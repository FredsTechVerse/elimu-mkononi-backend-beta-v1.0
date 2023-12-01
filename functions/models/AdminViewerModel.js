const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creates a model for saving customer credentials to the database.
//==================================================================
const AdminViewerSchema = new Schema(
  {
    firstName: { type: String, required: true, uppercase: true },
    surname: { type: String, required: true, uppercase: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, required: true, default: "active" },
    isEmailVerified: { type: Boolean, default: "false" },
    emailVerificationCode: { type: String },
    resetToken: { type: String },
    role: {
      type: String,
      required: true,
      uppercase: true,
      default: "EM-203",
    },
  },
  {
    timestamps: true,
  }
);

const AdminViewer = mongoose.model("AdminViewer", AdminViewerSchema);

module.exports = AdminViewer;
