const Message = require("../models/MessageModel");
const { handleError } = require("./ErrorHandling");
const { sendEmail } = require("./EmailController");
const axios = require("axios");
const smsConfig = {
  headers: {
    "Content-Type": "application/json",
    apikey: process.env.SMS_API_KEY,
  },
};
const sendMessage = async ({ message, recipients }) => {
  try {
    // Make sure recipients is an array of users.
    const processedContacts = recipients.map(
      (recipient) => `0${recipient.split("254")[1]}`
    );
    const smsPayload = {
      phone: process.env.SMS_CONTACT,
      message: message,
      recipient: [...processedContacts],
    };
    const { data } = await axios.post(
      "https://bulk-sms-production.up.railway.app/api/v1/sms/send",
      smsPayload,
      smsConfig
    );
    const messagePayload = { ...smsPayload, status: "delivered" };
    const messageData = await Message.create(messagePayload);
    messageData.save();
    return data;
  } catch (err) {
    const emailMessage = `Error message ${JSON.stringify(
      err.message
    )} . Comprehensive error :${JSON.stringify(err)}`;
    sendEmail({
      to: [process.env.TROUBLESHOOTING_EMAIL_ACCOUNT],
      subject: "SMS SERVICE HAS BEEN INTERRUPTED",
      text: emailMessage,
    });
    const smsPayload = {
      phone: process.env.SMS_CONTACT,
      message: message,
      recipient: [...recipients],
    };
    const messagePayload = { ...smsPayload, status: "rejected" };
    const messageData = await Message.create(messagePayload);
    messageData.save();
    return err;
  }
};

const messageController = async ({ req, res }) => {
  const { message, recipients } = req.body;
  const response = sendMessage({ message, recipients });
  res.status(200).json({ message: "Message successfully sent" });

  // Use an if statement based on the data returned to know what kind of response to return to user.
  // if (response) {
  //   res.status(200).json({ message: "Message successfully sent" });
  // } else {
  //   res.status(400).json({ message: "Some messages have not been sent" });
  // }
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
  sendMessage,
  messageController,
  findAllMessages,
  findMessage,
  deleteMessage,
};
