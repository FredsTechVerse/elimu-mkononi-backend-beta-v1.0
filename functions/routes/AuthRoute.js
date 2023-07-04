const axios = require("axios");
const express = require("express");
const router = express.Router();

// IMPORT CONTROLLERS
//====================
const {
  createTokenModel,
  renewTokens,
  authenticateToken,
  findStudentById,
  findAllStudents,
  registerStudent,
  deleteStudentById,
  findTutorById,
  findAllTutors,
  registerTutor,
  deleteTutorById,
  findAdminById,
  findAllAdmins,
  registerAdmin,
  deleteAdminById,
  logInUser,
  logOutUser,
} = require("../controllers/AuthController");

// STUDENT ROUTES
router.get("/all-students", findAllStudents);
router.get("/student/:studentId", findStudentById);
router.post("/register-student", registerStudent);
router.delete("/student", deleteStudentById);

// TUTOR ROUTES
router.get("/all-tutors", findAllTutors);
router.get("/tutor", authenticateToken, findTutorById);
router.post("/register-tutor", registerTutor);
router.delete("/tutor", deleteTutorById);

// ADMIN ROUTES
router.get("/all-admins", findAllAdmins);
router.get("/admin/:adminId", findAdminById);
router.post("/register-admin", registerAdmin);
router.delete("/admin", deleteAdminById);

// AUTHORIZATION ROUTES
router.post("/create-token", createTokenModel);
router.post("/login", logInUser);
router.post("/refresh-token", renewTokens);
router.delete("/logout", logOutUser);

router.get("/getToken", (req, res) => {
  const { code } = req.query;

  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  axios
    .post(tokenEndpoint, {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    })
    .then((response) => {
      const accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;
      console.log(`Access Token :${JSON.stringify(accessToken)}`);
      // Use the access token for further API requests or store it securely
      // You can also retrieve additional information like the refresh token from the response if required
      res.send("Access token received: " + accessToken);
    })
    .catch((error) => {
      console.error("Error exchanging code for access token:", error);
      res.status(500).send("Failed to obtain access token");
    });
});

module.exports = router;
