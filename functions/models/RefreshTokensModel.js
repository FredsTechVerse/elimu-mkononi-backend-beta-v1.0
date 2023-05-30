const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creates a model for saving customer credentials to the database.
//==================================================================
const RefreshTokenSchema = new Schema(
  {
    name: { type: String, required: true, default: "tokens" },
    data: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;
