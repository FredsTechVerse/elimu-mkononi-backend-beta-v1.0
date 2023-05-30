const mongoose = require("mongoose");

const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    courseImage: { type: String, required: true },
    courseTitle: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
    },
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
