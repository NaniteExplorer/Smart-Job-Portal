import ErrorHandler from "../utils/errorhandler.js";

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
  }

  // Duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    err = new ErrorHandler(`This ${field} is already registered`, 409);
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    err = new ErrorHandler(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid authentication token, please log in again", 401);
  }
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Session expired, please log in again", 401);
  }

  const payload = { success: false, message: err.message };
  // Surface stack traces only in development.
  if (process.env.NODE_ENV !== "production") payload.stack = err.stack;

  res.status(err.statusCode).json(payload);
};

export default errorHandler;
