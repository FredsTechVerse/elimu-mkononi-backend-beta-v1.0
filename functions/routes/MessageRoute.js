const express = require("express");
const router = express.Router();
const {
  registerMessage,
  findAllMessages,
  findMessage,
  deleteMessage,
} = require("../controllers/MessageController");

router.post("/", registerMessage);
router.get("/all-messages", findAllMessages);
router.get("/:messageID", findMessage);
router.delete("/:messageID", deleteMessage);
module.exports = router;
