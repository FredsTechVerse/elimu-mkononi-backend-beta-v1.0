const handleError = (error) => {
  //   Handle specific Mongoose errors
  if (error.name === "MongoError" && error.code === 11000) {
    const errorBody = { message: "This document already exists!" };
    return res.status(409).json(errorBody);
  } else if (error.name === "ValidationError") {
    const errorBody = { message: error.message };
    return res.status(400).json(errorBody);
  } else if (error.name === "CastError") {
    const errorBody = { message: "Invalid ID" };
    return res.status(422).json(errorBody);
  }
  // Log other errors
  console.log(error);
  // Send a generic error message with a 500 status code
  const errorBody = { message: "Something went wrong" };
  return res.status(500).json(errorBody);
};

module.exports = { handleError };
