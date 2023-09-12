const Message = require("../models/MessageModel");
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorModel");
const Admin = require("../models/AdminModel");

const { handleError } = require("./ErrorHandling");
const { sendEmail } = require("./EmailController");
const axios = require("axios");
const smsConfig = {
  headers: {
    "Content-Type": "application/json",
    apikey: process.env.SMS_API_KEY,
  },
};
const sendMessage = async ({ message, recipients, role }) => {
  try {
    const processedContacts = recipients.map(
      (recipient) => `0${recipient.split("254")[1]}`
    );
    const smsPayload = {
      phone: process.env.SMS_CONTACT,
      message: message,
      recipient: [...processedContacts],
    };
    const { data } = await axios.post(
      `${process.env.SMS_BASE_URL}/api/v1/sms/send`,
      smsPayload,
      smsConfig
    );
    const { balance } = data.data;
    if (balance <= 10.0 && balance >= 5.0) {
      sendEmail({
        to: [process.env.TROUBLESHOOTING_EMAIL_ACCOUNT],
        subject: "SMS RECHARGE REMINDER",
        text: `Kindly recharge sms bundles. Current balance ${JSON.stringify(
          balance
        )}`,
      });
    }
    const messagePayload = { ...smsPayload, status: "delivered", role };
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
      role,
    });
    const smsPayload = {
      phone: process.env.SMS_CONTACT,
      message: message,
      recipient: [...recipients],
    };
    const messagePayload = { ...smsPayload, status: "rejected", role };

    const messageData = await Message.create(messagePayload);
    messageData.save();
    return err;
  }
};

const messageIndividual = async (req, res) => {
  const { message, recipients, email, role } = req.body;

  sendEmail({
    to: [email],
    subject: "ELIMU HUB",
    text: message,
    role,
  });
  sendMessage({ message, recipients, role });
  res.status(200).json({ message: "Message sent" });
};
const messageStudents = async (req, res) => {
  const { message, role } = req.body;
  const studentsData = await Student.find().select("email contact");

  sendEmail({
    to: studentsData.map((student) => student.email),
    subject: "ELIMU HUB",
    text: message,
    role,
  });
  sendMessage({
    message,
    recipients: studentsData.map((student) => student.contact),
    role,
  });
  res.status(200).json({ message: "Messages have been sent" });
};
const messageTutors = async (req, res) => {
  const { message, role } = req.body;
  const tutorsData = await Tutor.find().select("email contact");

  sendEmail({
    to: tutorsData.map((tutor) => tutor.email),
    subject: "ELIMU HUB",
    text: message,
    role,
  });
  sendMessage({
    message,
    recipients: tutorsData.map((tutor) => tutor.contact),
    role,
  });
  res.status(200).json({ message: "Messages have been sent" });
};
const messageAdmins = async (req, res) => {
  const { message, role } = req.body;
  const adminsData = await Admin.find().select("email contact");

  sendEmail({
    to: adminsData.map((admin) => admin.email),
    subject: "ELIMU HUB",
    text: message,
    role,
  });
  sendMessage({
    message,
    recipients: adminsData.map((admin) => admin.contact),
    role,
  });
  res.status(200).json({ message: "Messages have been sent" });
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
  messageIndividual,
  messageStudents,
  messageTutors,
  messageAdmins,
  findAllMessages,
  findMessage,
  deleteMessage,
};
