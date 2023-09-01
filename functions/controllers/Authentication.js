const bcrypt = require("bcrypt");

// MODELS SECTION
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorModel");
const Admin = require("../models/AdminModel");
const RefreshToken = require("../models/RefreshTokensModel");
const { handleError } = require("./ErrorHandling");
const { sendResetToken } = require("../controllers/EmailController");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./Authorization");

const aggregateUsers = async (req, res) => {
  try {
    let totalStudents = await Student.count();
    let totalTutors = await Tutor.count();
    let totalAdmins = await Admin.count();

    const usersCount = { totalStudents, totalTutors, totalAdmins };
    console.log(usersCount);
    res.status(200).json(usersCount);
  } catch (err) {
    console.log(`User aggregation error ${JSON.stringify(err)}`);
    handleError(err, res);
  }
};

const logInUser = async (req, res) => {
  try {
    let userData = null;
    userData = await Student.findOne({ email: req.body.email });
    if (!userData) {
      userData = await Tutor.findOne({ email: req.body.email });
    }
    if (!userData) {
      userData = await Admin.findOne({ email: req.body.email });
    }
    if (!userData) {
      return res.status(404).json({ message: "Invalid username/password" });
    }
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid username/password" });
    }
    const user = {
      userID: userData._id,
      email: userData.email,
      surname: userData.surname,
      role: userData.role,
    };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const { _id: tokenID } = await RefreshToken.findOne({ name: "tokens" });
    const refreshTokenData = await RefreshToken.findByIdAndUpdate(
      tokenID,
      { $push: { data: refreshToken } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (refreshTokenData._doc.data.includes(refreshToken)) {
      res.status(200).json({
        accessToken,
        refreshToken,
        roles: [user.role],
      });
    }
  } catch (err) {
    console.log(err);
    handleError(err, res);
  }
};

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const verifyContact = async (req, res) => {
  const { contact, email } = req.body;
  console.log(
    `Contact Verification Data ${JSON.stringify({ contact, email })}`
  );
  try {
    let userData = null;
    userData = await Student.findOne({ contact: req.body.contact });
    if (!userData) {
      userData = await Tutor.findOne({ contact: req.body.contact });
    }
    if (!userData) {
      userData = await Admin.findOne({ contact: req.body.contact });
    }
    if (!userData) {
      return res.status(404).json({ message: "Invalid contact" });
    }
    const resetToken = generateRandomString(6);

    console.log({ resetToken });
    const userID = userData?._id;
    const role = userData?.role;
    const userInfo = { resetToken, role, userID };
    const userRole = () => {
      if (role === "EM-201") {
        return "Student";
      } else if (role === "EM-202") {
        return "Tutor";
      } else if (role === "EM-203") {
        return "Admin";
      }
    };
    const accessToken = generateAccessToken(userInfo);
    const credentials = { resetToken };

    sendResetToken({
      firstName: userData?.firstName,
      emails: [req.body.email],
      subject: "PASSWORD RESET",
      role: userRole(),
      resetToken,
    });

    console.log({ userInfo, accessToken });
    if (role === "EM-201") {
      await Student.findByIdAndUpdate(userID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(200).json({ userInfo, accessToken });
    } else if (role === "EM-202") {
      await Tutor.findByIdAndUpdate(userID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(200).json({ userInfo, accessToken });
    } else if (role === "EM-203") {
      await Admin.findByIdAndUpdate(userID, credentials, {
        new: true,
        upsert: true,
      });
      res.status(200).json({ userInfo, accessToken });
    } else {
      res.status(500).json({ message: "Error while updating user." });
    }
  } catch (err) {
    console.log(err);
    handleError(err, res);
  }
};

const logOutUser = async (req, res) => {
  try {
    if (!req.body.refreshToken) {
      return res.status(404).json({ message: "Refresh tokens not found." });
    }

    await RefreshToken.findOneAndUpdate(
      { name: "tokens" },
      { $pull: { data: req.body.refreshToken } }
    );
    res.sendStatus(200);
  } catch (err) {
    handleError(err, res);
  }
};

const findAllUsers = async (req, res) => {
  try {
    if (req?.user?.role.includes("EM-203")) {
      const studentData = await Student.find({});
      const tutorData = await Tutor.find({});
      const adminData = await Admin.find({});

      const totalUsers = {
        totalStudents: studentData?.length,
        totalTutors: tutorData?.length,
        totalAdmins: adminData?.length,
      };

      res.status(200).json(totalUsers);
    } else {
      res.status(401).json({ message: "User action not allowed" });
    }
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = {
  logInUser,
  logOutUser,
  findAllUsers,
  aggregateUsers,
  verifyContact,
  generateRandomString,
};
