import User, { ROLES } from "../models/userModel.js";
import Job from "../models/jobModel.js";
import Application from "../models/applicationModel.js";
import Event from "../models/eventModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import { normalizeSkills } from "./authController.js";

// GET own profile (rich population per role)
export const getMyProfile = catchAsyncError(async (req, res, next) => {
  let q = User.findById(req.user.id);

  if (req.user.role === ROLES.STUDENT) {
    q = q.populate("university", "name address website").populate("appliedJobs", "title location");
  } else if (req.user.role === ROLES.RECRUITER) {
    q = q.populate("jobsPosted", "title status applicants");
  } else if (req.user.role === ROLES.UNIVERSITY) {
    q = q.populate("students", "firstName lastName email major");
  }

  const user = await q;
  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({ success: true, user });
});

// GET any public profile by id
export const getPublicProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "-email -appliedJobs -savedJobs -students"
  );
  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({ success: true, user });
});

// UPDATE own profile — whitelisted fields per role
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const b = req.body;
  const update = {};
  const common = ["phone", "bio", "website", "address", "description"];
  common.forEach((f) => b[f] !== undefined && (update[f] = b[f]));

  if (req.user.role === ROLES.STUDENT) {
    ["firstName", "lastName", "degree", "major", "graduationYear"].forEach(
      (f) => b[f] !== undefined && (update[f] = b[f])
    );
    if (b.skills !== undefined) update.skills = normalizeSkills(b.skills);
  } else if (req.user.role === ROLES.RECRUITER) {
    if (b.companyName !== undefined) update.companyName = b.companyName;
  } else if (req.user.role === ROLES.UNIVERSITY) {
    if (b.name !== undefined) update.name = b.name;
  }

  const user = await User.findByIdAndUpdate(req.user.id, update, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
});

// UPDATE own password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new ErrorHandler("Old password is incorrect", 400));

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  if (!newPassword || newPassword.length < 8) {
    return next(new ErrorHandler("Password must be at least 8 characters", 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated" });
});

// DELETE own account — and clean up references safely
export const deleteAccount = catchAsyncError(async (req, res, next) => {
  const id = req.user.id;

  if (req.user.role === ROLES.STUDENT) {
    await Application.deleteMany({ student: id });
    await Job.updateMany({ applicants: id }, { $pull: { applicants: id } });
    await User.updateMany({ students: id }, { $pull: { students: id } });
    await Event.updateMany({ participants: id }, { $pull: { participants: id } });
  } else if (req.user.role === ROLES.RECRUITER) {
    const jobs = await Job.find({ employer: id }).select("_id");
    const jobIds = jobs.map((j) => j._id);
    await Application.deleteMany({ job: { $in: jobIds } });
    await Job.deleteMany({ employer: id });
  } else if (req.user.role === ROLES.UNIVERSITY) {
    await User.updateMany({ university: id }, { $unset: { university: "" } });
  }

  await User.findByIdAndDelete(id);

  res
    .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
    .status(200)
    .json({ success: true, message: "Account deleted" });
});

// Role-specific dashboard summary
export const getDashboard = catchAsyncError(async (req, res, next) => {
  const id = req.user.id;
  const role = req.user.role;

  if (role === ROLES.STUDENT) {
    const applications = await Application.find({ student: id })
      .populate("job", "title location jobType")
      .sort("-createdAt");
    const savedCount = (req.user.savedJobs || []).length;
    const byStatus = applications.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});
    return res.status(200).json({
      success: true,
      dashboard: {
        totalApplications: applications.length,
        savedJobs: savedCount,
        byStatus,
        recentApplications: applications.slice(0, 5),
      },
    });
  }

  if (role === ROLES.RECRUITER) {
    const jobs = await Job.find({ employer: id });
    const jobIds = jobs.map((j) => j._id);
    const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });
    const events = await Event.countDocuments({ host: id });
    return res.status(200).json({
      success: true,
      dashboard: {
        totalJobs: jobs.length,
        openJobs: jobs.filter((j) => j.status === "Open").length,
        totalApplicants,
        eventsHosted: events,
      },
    });
  }

  // University
  const students = await User.countDocuments({ university: id, role: ROLES.STUDENT });
  const events = await Event.countDocuments({ host: id });
  return res.status(200).json({
    success: true,
    dashboard: { totalStudents: students, eventsHosted: events },
  });
});

// Directory search (students for recruiters/universities, etc.)
export const searchUsers = catchAsyncError(async (req, res) => {
  const { role, keyword } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (keyword) {
    const safe = String(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { firstName: { $regex: safe, $options: "i" } },
      { lastName: { $regex: safe, $options: "i" } },
      { companyName: { $regex: safe, $options: "i" } },
      { name: { $regex: safe, $options: "i" } },
    ];
  }
  const users = await User.find(filter).select("role firstName lastName companyName name avatar major").limit(50);
  res.status(200).json({ success: true, users });
});
