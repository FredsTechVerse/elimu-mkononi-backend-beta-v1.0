const Message = require("../models/MessageModel");
const { handleError } = require("./ErrorHandling");
const registerMessage = async (req, res) => {
  try {
    const { phone, message, recipient, status } = req.body;
    console.log({ phone, message, recipient, status });
    const messagePayload = { phone, message, recipient, status };
    const messageData = await Message.create(messagePayload);
    messageData.save();
    console.log("Message saved successfully");
    res.status(200).json({ message: "Message saved succesfully" });
  } catch (err) {
    handleError(err, res);
  }
};
const findAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).send(messages);
  } catch (error) {
    handleError(err, res);
  }
};
const findMessage = async (req, res) => {
  try {
    const { messageID } = req.params;
    const message = await Message.findById(messageID);
    res.status(200).send(message);
  } catch (error) {
    handleError(err, res);
  }
};
const deleteMessage = async (req, res) => {
  try {
    const { messageID } = req.params;
    await Message.findByIdAndDelete(messageID);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    handleError(err, res);
  }
};

module.exports = {
  registerMessage,
  findAllMessages,
  findMessage,
  deleteMessage,
};
