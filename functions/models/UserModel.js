const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true, uppercase: true },
  lastName: { type: String, required: true, uppercase: true },
  DOB: { type: String, required: true, uppercase: true },
  residence: { type: String, required: true, uppercase: true },
  contact: { type: String, required: true, uppercase: true },
  email: { type: String, required: true, uppercase: true },
  gender: { type: String, required: true, uppercase: true },
  isInterestedToServe: { type: String, required: true, uppercase: true },
  serviceGroup: { type: String, required: true, uppercase: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
