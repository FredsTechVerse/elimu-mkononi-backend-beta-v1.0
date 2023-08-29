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

const aggregateUsers = async (req, res) => {
  try {
    let totalStudents = await Student.aggregate([
      { $group: { _id: "$role", studentCount: { $sum: 1 } } }, // Simple groups by ID
    ]);
    let totalTutors = await Tutor.aggregate([
      { $group: { _id: "$role", tutorCount: { $sum: 1 } } },
    ]);
    let totalAdmins = await Admin.aggregate([
      { $group: { _id: "$role", adminCount: { $sum: 1 } } },
    ]);

    const usersData = [...totalStudents, ...totalTutors, ...totalAdmins];

    const refinedData = {
      students: usersData[0].studentCount,
      tutors: usersData[1].tutorCount,
      admins: usersData[2].adminCount,
    };

    console.log(refinedData);
    res.status(200).json(refinedData);
  } catch (err) {
    console.log(`User aggregation error ${JSON.stringify(err)}`);
    handleError(err, res);
  }
};

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
      res.sendStatus(401);
    }
  } catch (err) {
    handleError(err, res);
  }
};

module.exports = { logInUser, logOutUser, findAllUsers, aggregateUsers };
