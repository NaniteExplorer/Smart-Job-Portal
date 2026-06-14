import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "./catchAsyncError.js";

/**
 * Verifies the JWT (from cookie or Authorization header), loads the user, and
 * attaches it to `req.user`. Rejects if the user no longer exists, so deleted
 * accounts can't keep using a still-valid token.
 */
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token = req.cookies?.token;
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("Please log in to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("Account no longer exists", 401));
  }

  req.user = user;
  next();
});

/**
 * Restricts a route to one or more roles. Usage: authorizeRoles("recruiter").
 */
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorHandler(
        `Role '${req.user.role}' is not allowed to access this resource`,
        403
      )
    );
  }
  next();
};
