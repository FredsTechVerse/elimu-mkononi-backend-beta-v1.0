const mongoose = require("mongoose");
const { Schema } = mongoose;

const EmailSchema = new Schema({
  from: { type: String, required: true },
  to: [{ type: String, required: true }],
  role: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  status: { type: String, required: true },
});

const Email = mongoose.model("Email", EmailSchema);

module.exports = Email;
