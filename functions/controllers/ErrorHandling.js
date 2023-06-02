const handleError = (error, res) => {
  let statusCode = 500;
  let errorMessage = "Something went wrong";

  if (error.name === "MongoError" && error.code === 11000) {
    statusCode = 409;
    errorMessage = "This document already exists!";
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    errorMessage = error.message;
  } else if (error.name === "CastError") {
    statusCode = 422;
    errorMessage = "Invalid ID";
  }

  // Log other errors
  console.error(error);

  // Send the error response
  return res.status(statusCode).json({ message: errorMessage });
};

module.exports = { handleError };
