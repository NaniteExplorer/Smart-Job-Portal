import User, { ROLES } from "../models/userModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import sendToken from "../utils/jwtToken.js";

/**
 * Unified registration for all roles. The frontend passes `role` and the
 * fields relevant to that role; we whitelist per role so a student can't, say,
 * set themselves up with `jobsPosted`.
 */
export const register = catchAsyncError(async (req, res, next) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return next(new ErrorHandler("Role, email and password are required", 400));
  }
  if (!Object.values(ROLES).includes(role)) {
    return next(new ErrorHandler("Invalid role", 400));
  }

  const base = { role, email, password };
  let data = base;

  if (role === ROLES.STUDENT) {
    const { firstName, lastName, university, degree, major, graduationYear, skills } = req.body;
    if (!firstName || !lastName) {
      return next(new ErrorHandler("First and last name are required", 400));
    }
    data = {
      ...base,
      firstName,
      lastName,
      university: university || undefined,
      degree,
      major,
      graduationYear,
      skills: normalizeSkills(skills),
    };
  } else if (role === ROLES.RECRUITER) {
    const { companyName, address, description, website } = req.body;
    if (!companyName) return next(new ErrorHandler("Company name is required", 400));
    data = { ...base, companyName, address, description, website };
  } else if (role === ROLES.UNIVERSITY) {
    const { name, address, description, website } = req.body;
    if (!name) return next(new ErrorHandler("University name is required", 400));
    data = { ...base, name, address, description, website };
  }

  const user = await User.create(data);

  // Link student to their university roster.
  if (role === ROLES.STUDENT && user.university) {
    await User.findByIdAndUpdate(user.university, {
      $addToSet: { students: user._id },
    });
  }

  sendToken(user, 201, res);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required", 400));
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

export const logout = catchAsyncError(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out" });
});

// Accepts "a, b, c" string or array; returns a clean array.
function normalizeSkills(skills) {
  if (Array.isArray(skills)) return skills.map((s) => String(s).trim()).filter(Boolean);
  if (typeof skills === "string") {
    return skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export { normalizeSkills };
