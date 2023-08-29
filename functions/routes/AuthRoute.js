const express = require("express");
const router = express.Router();

// IMPORT CONTROLLERS
//====================
const { registerUser } = require("../controllers/TutorControllers");
const {
  logInUser,
  logOutUser,
  findAllUsers,
  aggregateUsers,
} = require("../controllers/Authentication");

const {
  verifyAccess,
  createTokenModel,
  renewTokens,
} = require("../controllers/Authorization");

// AUTHORIZATION ROUTES
router.post("/user", registerUser);
router.post("/create-token", createTokenModel);
router.post("/login", logInUser);
router.delete("/logout", logOutUser);
router.post("/refresh-token", renewTokens);
router.get("/verify-access", verifyAccess);
router.get("/all-users", findAllUsers);
router.get("/aggregate", aggregateUsers);

module.exports = router;
