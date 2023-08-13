const bcrypt = require("bcrypt");

// MODELS SECTION
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorModel");
const Admin = require("../models/AdminModel");
const RefreshToken = require("../models/RefreshTokensModel");
const { handleError } = require("./ErrorHandling");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./Authorization");

const logInUser = async (req, res) => {
  try {
    let userData = null;
    userData = await Student.findOne({ firstName: req.body.firstName });
    if (!userData) {
      userData = await Tutor.findOne({ firstName: req.body.firstName });
    }
    if (!userData) {
      userData = await Admin.findOne({ firstName: req.body.firstName });
    }
    if (!userData) {
      return res.sendStatus(404);
    }
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (!passwordMatches) {
      return res.status(401).json({ message: "The passwords do not match" });
    }
    const user = {
      userID: userData._id,
      firstName: userData.firstName,
      surname: userData.surname,
      role: userData.role,
    };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    let { _id: tokenID } = await RefreshToken.findOne({ name: "tokens" });
    let refreshTokenData = await RefreshToken.findByIdAndUpdate(
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
    handleError(err, res);
  }
};

// const logOutUser = async (req, res) => {
//   try {
//     if (!req.body) {
//       return res.status(404).json({ message: "Refresh tokens not found." });
//     }
//     let refreshTokens = await RefreshToken.findOne({ name: "tokens" });
//     // Removes particular token
//     refreshTokens.data = refreshTokens.data.filter(
//       (token) => token !== req.body.refreshToken
//     );
//     await refreshTokens.save();
//     res.sendStatus(200);
//   } catch (err) {
//     handleError(err, res);
//   }
// };

const logOutUser = async (req, res) => {
  try {
    if (!req.body.refreshToken) {
      return res.status(404).json({ message: "Refresh tokens not found." });
    }

    await RefreshToken.findOneAndUpdate(
      { name: "tokens" },
      { data: { $pull: req.body.refreshToken } }
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

      let totalUsers = {
        totalStudents: studentData?.length,
        totalTutors: tutorData?.length,
        totalAdmins: adminData?.length,
      };

      res.status(200).json(totalUsers);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { logInUser, logOutUser, findAllUsers };
