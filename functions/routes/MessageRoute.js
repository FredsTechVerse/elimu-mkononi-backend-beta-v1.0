const express = require("express");
const router = express.Router();
const {
  messageIndividual,
  findAllMessages,
  findMessage,
  deleteMessage,
  messageStudents,
  messageTutors,
  messageAdmins,
} = require("../controllers/MessageController");

router.post("/", messageIndividual);
router.post("/all-students", messageStudents);
router.post("/all-tutors", messageTutors);
router.post("/all-admins", messageAdmins);
router.get("/all-messages", findAllMessages);
router.get("/:messageID", findMessage);
router.delete("/:messageID", deleteMessage);
module.exports = router;
