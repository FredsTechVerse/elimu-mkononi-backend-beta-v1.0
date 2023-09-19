const { sendEmail } = require("./EmailController");
const handleError = (err, res) => {
  let statusCode = 500;
  let errorMessage = "Sorry,something went wrong";

  if (err.code === 11000) {
    statusCode = 409;
    errorMessage = "This document already exists!";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.name === "CastError") {
    statusCode = 422;
    errorMessage = "Invalid ID";
  } else {
    errorMessage = err.message;
  }

  const emailMessage = `${errorMessage.toUpperCase()} Message ${err.message.toUpperCase()} , Error ${JSON.stringify(
    err
  )} `;

  // console.log(emailMessage);
  sendEmail({
    to: process.env.TROUBLESHOOTING_EMAIL_ACCOUNT,
    subject: "SERVER ERROR",
    text: emailMessage,
  });
  return res.status(statusCode).json({ message: errorMessage });
};

const handleRenewTokenError = (err, res) => {
  if (err.name === "TokenExpiredError") {
    return res.status(403).json({ message: "Token has expired" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  sendEmail({
    to: process.env.TROUBLESHOOTING_EMAIL_ACCOUNT,
    subject: "RENEW TOKEN ERROR",
    text: "Something went wrong while renewing token",
  });
  return res
    .status(500)
    .json({ message: "Something went wrong while renewing token" });
};

const handleJwtError = (err, res) => {
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  const emailMessage = `${err.name.toUpperCase()}.Comprehensive error : ${JSON.stringify(
    err
  )} `;
  sendEmail({
    to: process.env.TROUBLESHOOTING_EMAIL_ACCOUNT,
    subject: "JWT ERROR",
    text: emailMessage,
  });
  return res
    .status(500)
    .json({ message: "Something went wrong during authentication" });
};

module.exports = { handleError, handleJwtError, handleRenewTokenError };
