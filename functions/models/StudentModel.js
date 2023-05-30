const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creates a model for saving customer credentials to the database.
//==================================================================
const StudentSchema = new Schema(
  {
    firstName: { type: String, required: true, uppercase: true },
    surname: { type: String, required: true, uppercase: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, required: true, default: "free" }, //Account status is free until payment is approved.
    role: {
      type: String,
      required: true,
      uppercase: true,
      default: "EM-201",
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
