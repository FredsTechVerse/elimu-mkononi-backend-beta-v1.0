const express = require("express");
const router = express.Router();
const { findAllEmails } = require("../controllers/EmailController");

router.get("/all-emails", findAllEmails);

module.exports = router;
