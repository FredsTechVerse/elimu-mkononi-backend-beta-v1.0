const express = require("express");
const router = express.Router();

// IMPORT CONTROLLERS
//====================
const {
  logInUser,
  logOutUser,
  findAllUsers,
  aggregateUsers,
  verifyContact,
} = require("../controllers/Authentication");

const {
  verifyAccess,
  createTokenModel,
  renewTokens,
} = require("../controllers/Authorization");

const { sendEmail } = require("../controllers/EmailController");

// AUTHORIZATION ROUTES
router.post("/email", sendEmail);
router.post("/create-token", createTokenModel);
router.post("/login", logInUser);
router.delete("/logout", logOutUser);
router.post("/refresh-token", renewTokens);
router.post("/verify-contact", verifyContact);
router.get("/verify-access", verifyAccess);
router.get("/all-users", findAllUsers);
router.get("/aggregated-users", aggregateUsers);

module.exports = router;
