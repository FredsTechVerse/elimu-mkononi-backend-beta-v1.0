const handleError = (err, res) => {
  let statusCode = 500;
  let errorMessage = "Something went wrong";

  if (err.name === "MongoError" && err.code === 11000) {
    statusCode = 409;
    errorMessage = "This document already exists!";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.name === "CastError") {
    statusCode = 422;
    errorMessage = "Invalid ID";
  }
  console.log(err);

  // Send the error response
  return res.status(statusCode).json({ message: errorMessage });
};

const handleJwtError = (err, res) => {
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  return res
    .status(500)
    .json({ message: "Something went wrong during authentication" });
};

module.exports = { handleError, handleJwtError };
