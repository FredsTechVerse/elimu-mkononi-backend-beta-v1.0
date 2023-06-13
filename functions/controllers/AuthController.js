if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// MODELS SECTION
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorModel");
const Admin = require("../models/AdminModel");
const RefreshToken = require("../models/RefreshTokensModel");
const { handleError, handleJwtError } = require("./ErrorHandling");

// AUTHORIZATION SECTION
//=======================
const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m", //Usually shorter for sercurity reasons.
  });
};
const generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y", //Should have a longer expiration time.
  });
};

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.sendStatus(401);
    }
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    handleJwtError(err);
  }
};

const createTokenModel = async (req, res) => {
  try {
    const initialData = {
      data: [],
    };
    let tokenData = await RefreshToken.create(initialData);
    tokenData.save();
    res.status(200);
  } catch (err) {
    handleError(err);
  }
};
const renewTokens = async (req, res) => {
  // Trap 1 : Checks if the refresh token is present
  const refreshToken = req.body?.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }
  // Trap 2 : Compares the refresh tokens

  let refreshTokens = await RefreshToken.findOne({ name: "tokens" });
  if (!refreshTokens.data.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({
        message:
          "We have your refresh token but somehow we are encountering some issues.",
      });
    } else {
      // We destructure to sieve only the info that we require.
      const { firstName, surname, role } = payload;
      const userData = { firstName, surname, role };
      const accessToken = generateAccessToken(userData);
      res.json({ accessToken, refreshToken });
    }
  });
};

// REGISTRATION SECTION
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
    const student = await Student.create(credentials);
    student.save();
    res
      .status(201)
      .json({ message: "Student has been registered successfully." });
  } catch (err) {
    handleError(err);
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
    const tutor = await Tutor.create(credentials);
    tutor.save();
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
    const tutor = await Admin.create(credentials);
    tutor.save();
    res.sendStatus(201);
  } catch (err) {
    handleError(err);
  }
};

// LOGIN SECTION
//===============
const logInUser = async (req, res) => {
  try {
    let userData = null;
    let role = null;

    // First, check if user is a student
    userData = await Student.findOne({ firstName: req.body.firstName });
    if (!userData) {
      userData = await Tutor.findOne({ firstName: req.body.firstName });
    }
    if (!userData) {
      userData = await Admin.findOne({ firstName: req.body.firstName });
    }
    if (!userData) {
      // If user is not found in any database, return 404
      return res.sendStatus(404);
    }

    // Check if password is correct
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (!passwordMatches) {
      return res.sendStatus(401);
    }

    // If everything is OK, generate and send access and refresh tokens
    const user = {
      firstName: userData.firstName,
      surname: userData.surname,
      role: userData.role,
      _id: userData._id,
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
        user: { firstName: user.firstName, surname: user.surname },
        roles: [user.role],
      });
    }
  } catch (err) {
    handleError(err);
  }
};

const logOutUser = async (req, res) => {
  try {
    // Check if refreshTokens document exists
    let refreshTokens = await RefreshToken.findOne({ name: "tokens" });
    if (!refreshTokens) {
      return res.status(404).json({ message: "Refresh tokens not found." });
    }

    // Remove token from refreshTokens data
    refreshTokens.data = refreshTokens.data.filter(
      (token) => token !== req.body.token
    );

    // Save refreshTokens document
    await refreshTokens.save();

    // Send success response
    res.sendStatus(204);
  } catch (err) {
    handleError(err);
  }
};

// TUTOR SECTION
const findTutorById = async (req, res) => {
  try {
    let { _id: tutorId } = req.user;
    let tutorData = await Tutor.findById(tutorId).populate({
      path: "units",
      populate: "unitChapters",
    });
    res.status(200).json(tutorData);
  } catch (err) {
    handleError(err);
  }
};
const findAllTutors = async (req, res) => {
  try {
    const tutorData = await Tutor.find({});
    res.status(200).json(tutorData);
  } catch (err) {
    res.status(400).json(err);
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
    res.status(400).json(err);
  }
};

// ADMIN SECTION
const findAllAdmins = async (req, res) => {
  try {
    const adminData = await Admin.find({});
    res.status(200).json(adminData);
  } catch (err) {
    res.status(400).json(err);
  }
};

const findAdminById = async (req, res) => {
  try {
    let { adminId } = req.params;
    let adminData = await Admin.findById(adminId);
    res.status(200).json(adminData);
  } catch (err) {
    handleError(err);
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
    handleError(err);
  }
};

// STUDENT SECTION
const findStudentById = async (req, res) => {
  try {
    let { studentId } = req.params;
    let studentData = await Student.findById(studentId);
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err);
  }
};

const findAllStudents = async (req, res) => {
  try {
    const studentData = await Student.find({});
    res.status(200).json(studentData);
  } catch (err) {
    handleError(err);
  }
};

const deleteStudentById = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.body._id, function (err, docs) {
      if (!err) {
        res.status(200).json(docs);
      } else {
        res.status(400).send(err);
      }
    });
  } catch (err) {
    handleError(err);
  }
};

// STUDENT SECTION
//=================
module.exports = {
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
};
