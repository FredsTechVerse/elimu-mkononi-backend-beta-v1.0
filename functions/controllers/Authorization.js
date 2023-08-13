const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshTokensModel");

const {
  handleError,
  handleJwtError,
  handleRenewTokenError,
} = require("./ErrorHandling");

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

// STUDENT SECTION
//=================
module.exports = {
  verifyAccess,
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  createTokenModel,
  renewTokens,
};
