const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  phone: { type: String, required: true },
  message: { type: String, required: true },
  recipient: [{ type: String, required: true }],
  status: { type: String, required: true },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
