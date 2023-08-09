const AppError = require("../utils/appError");

function handleTypeErrorDB(err) {
  return new AppError("Invalid input type", 400);
}

function handleMissingValueDB(err) {
  const errMessage = err.message;
  const regex = /'([^']+)'/;
  const matches = errMessage.match(regex);
  return new AppError(`${matches[0]} cannot be NULL`, 400);
}

function handleDuplicateErrorDB(err) {
  const errMessage = err.originaError.message;
  const matches = errMessage.match(/\((.*?)\)/);
  console.log(matches);
  return new AppError(
    `'${matches[1]}' already exists. Use a different one!`,
    400
  );
}

function handleTooLongErrorDB(err) {
  const errMessage = err.message;
  const matches = errMessage.match(/\(("(@?).*?")\)/);
  console.log(matches);
  return new AppError(`'${matches[1]}' is too long`, 400);
}

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () =>
  new AppError("Token has expired. Please log in again!", 401);

// Handle development errors
function handleDevelopmentError(err, req, res) {
  // console.log(err);
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  } else {
    return res.render("error", { err });
  }
  // Render pages
}

// Handle production errors
function handleProductionError(err, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(err.statusCode).json({
        status: err.status,
        message: "Something went wrong",
      });
    }
  } else {
    return res.render("error", { err });
  }

  // Render pages
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    if (err.number == 8114) err = handleTypeErrorDB(err);
    if (err.number == 2627) err = handleDuplicateErrorDB(err);
    if (err.number == 515) err = handleMissingValueDB(err);
    if (err.number == 8016) err = handleTooLongErrorDB(err);
    console.log("I am here");
    console.dir(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError(err);
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);
    handleDevelopmentError(err, req, res);
  } else {
    if (err.number == 8114) err = handleTypeErrorDB(err);
    if (err.number == 2627) err = handleDuplicateErrorDB(err);
    if (err.number == 515) err = handleMissingValueDB(err);
    if (err.number == 8016) err = handleTooLongErrorDB(err);
    console.log("I am here");
    console.dir(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError(err);
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);

    handleProductionError(err, req, res);
  }
};
