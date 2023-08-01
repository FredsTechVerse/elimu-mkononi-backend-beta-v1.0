const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// MODELS SECTION
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorModel");
const Admin = require("../models/AdminModel");
const RefreshToken = require("../models/RefreshTokensModel");
const {
  handleError,
  handleJwtError,
  handleRenewTokenError,
} = require("./ErrorHandling");

// AUTHORIZATION SECTION
//=======================
const verifyAccess = (req, res) => {
  try {
    res.status(200).json({ message: "Permission Granted!" });
  } catch (err) {
    handleError(err, res);
  }
};

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
const generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "24h",
  });
};

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (
      !token &&
      req.path !== "/course/all-courses" &&
      req.path !== "/auth/login" &&
      req.path !== "/auth/refresh-token" &&
      req.path !== "/auth/register-student" &&
      req.path !== "/auth/logout" &&
      !req.path.startsWith("/s3Direct/")
    ) {
      return res.sendStatus(403);
    } else if (
      req.path === "/course/all-courses" ||
      req.path === "/auth/login" ||
      req.path === "/auth/logout" ||
      req.path === "/auth/register-student" ||
      req.path === "/auth/refresh-token" ||
      req.path.startsWith("/s3Direct/")
    ) {
      req.user = null;
      return next();
    } else {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = payload;
      return next();
    }
  } catch (err) {
    handleJwtError(err, res);
  }
};

const createTokenModel = async (req, res) => {
  try {
    const initialData = {
      data: [],
    };
    let tokenData = await RefreshToken.create(initialData);
    tokenData.save();
    res.sendStatus(200);
  } catch (err) {
    handleError(err, res);
  }
};
const renewTokens = async (req, res) => {
  const refreshToken = req.body?.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(403);
  }

  let refreshTokens = await RefreshToken.findOne({ name: "tokens" });
  if (!refreshTokens.data.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      handleRenewTokenError(err, res);
    } else {
      const { firstName, surname, role, userID } = payload;
      const userData = { firstName, surname, role, userID };
      const accessToken = generateAccessToken(userData);
      res.json({ newAccessToken: accessToken });
    }
  });
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

const logOutUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(404).json({ message: "Refresh tokens not found." });
    }
    let refreshTokens = await RefreshToken.findOne({ name: "tokens" });
    // Removes particular token
    refreshTokens.data = refreshTokens.data.filter(
      (token) => token !== req.body.refreshToken
    );
    await refreshTokens.save();
    res.sendStatus(200);
  } catch (err) {
    handleError(err, res);
  }
};

const registerStudent = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    };
    const newStudent = await Student.create(credentials);
    newStudent.save();
    res
      .status(201)
      .json({ message: "Student has been registered successfully." });
  } catch (err) {
    handleError(err, res);
  }
};
const registerTutor = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    };
    const newTutor = await Tutor.create(credentials);
    newTutor.save();
    res.sendStatus(201);
  } catch (error) {
    handleError(error);
  }
};
const registerAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    };
    const newAdmin = await Admin.create(credentials);
    newAdmin.save();
    res.sendStatus(201);
  } catch (err) {
    handleError(err, res);
  }
};

// QUERY SECTION
const findTutorById = async (req, res) => {
  try {
    let { userID } = req.user;
    let tutorData = await Tutor.findById(userID).populate({
      path: "units",
      populate: "unitChapters",
    });
    res.status(200).json(tutorData);
  } catch (err) {
    handleError(err, res);
  }
};
const findAdminById = async (req, res) => {
  try {
    let { userID } = req.user;
    let adminData = await Admin.findById(userID);
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};
const findStudentById = async (req, res) => {
  try {
    let { studentId } = req.params;
    let studentData = await Student.findById(studentId);
    res.status(200).json(studentData);
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
const findAllStudents = async (req, res) => {
  try {
    const studentData = await Student.find({});
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err, res);
  }
};
const findAllTutors = async (req, res) => {
  try {
    const tutorData = await Tutor.find({});
    res.status(200).json(tutorData);
  } catch (err) {
    handleError(err, res);
  }
};

const findAllAdmins = async (req, res) => {
  try {
    const adminData = await Admin.find({});
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err, res);
  }
};

const deleteTutorById = async (req, res) => {
  try {
    await Tutor.findByIdAndDelete(req.body._id, function (err, docs) {
      if (!err) {
        res.status(200).json(docs);
      } else {
        res.status(400).send(err);
      }
    });
  } catch (err) {
    handleError(err, res);
  }
};
const deleteAdminById = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.body._id, function (err, docs) {
      if (!err) {
        res.status(200).json(docs);
      } else {
        res.status(400).send(err);
      }
    });
  } catch (err) {
    handleError(err, res);
  }
};

const deleteStudentById = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req?.body?._id);
  } catch (err) {
    handleError(err, res);
  }
};

// STUDENT SECTION
//=================
module.exports = {
  createTokenModel,
  renewTokens,
  authenticateToken,
  findStudentById,
  findAllUsers,
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
  verifyAccess,
};
