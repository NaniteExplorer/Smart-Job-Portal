import Job from "../models/jobModel.js";
import User, { ROLES } from "../models/userModel.js";
import Application from "../models/applicationModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ApiFeatures from "../utils/apifeatures.js";
import { normalizeSkills } from "./authController.js";

const RESULT_PER_PAGE = 12;

// Fields a recruiter may set on a job. Everything else (employer, applicants)
// is server-controlled — whitelisting here prevents mass-assignment attacks.
const JOB_FIELDS = [
  "title",
  "description",
  "location",
  "jobType",
  "experienceLevel",
  "salaryMin",
  "salaryMax",
  "skills",
  "requirements",
  "openings",
  "deadline",
  "universityPreference",
];

const pickJobFields = (body) => {
  const data = {};
  JOB_FIELDS.forEach((f) => body[f] !== undefined && (data[f] = body[f]));
  if (data.skills !== undefined) data.skills = normalizeSkills(data.skills);
  return data;
};

// Create Job — Recruiter
export const createJob = catchAsyncError(async (req, res, next) => {
  const data = { ...pickJobFields(req.body), employer: req.user.id };

  const job = await Job.create(data);
  await User.findByIdAndUpdate(req.user.id, { $addToSet: { jobsPosted: job._id } });

  res.status(201).json({ success: true, job });
});

// Update Job — Recruiter (owner only)
export const updateJob = catchAsyncError(async (req, res, next) => {
  let job = await Job.findById(req.params.id);
  if (!job) return next(new ErrorHandler("Job not found", 404));
  if (job.employer.toString() !== req.user.id) {
    return next(new ErrorHandler("You can only edit your own jobs", 403));
  }
  const data = pickJobFields(req.body);
  // `status` is editable on update only (not at creation).
  if (req.body.status !== undefined) data.status = req.body.status;
  job = await Job.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, job });
});

// Delete Job — Recruiter (owner only)
export const deleteJob = catchAsyncError(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new ErrorHandler("Job not found", 404));
  if (job.employer.toString() !== req.user.id) {
    return next(new ErrorHandler("You can only delete your own jobs", 403));
  }
  await Application.deleteMany({ job: job._id });
  await User.findByIdAndUpdate(req.user.id, { $pull: { jobsPosted: job._id } });
  await job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted" });
});

// Get all jobs (search + filter + pagination)
export const getAllJobs = catchAsyncError(async (req, res) => {
  const jobsCount = await Job.countDocuments();

  const feature = new ApiFeatures(
    Job.find().populate("employer", "companyName avatar"),
    req.query
  )
    .search()
    .filter()
    .sort();

  // Count filtered before pagination.
  const filteredQuery = new ApiFeatures(Job.find(), req.query).search().filter();
  const filteredJobsCount = await Job.countDocuments(filteredQuery.query.getFilter());

  feature.pagination(RESULT_PER_PAGE);
  const jobs = await feature.query;

  res.status(200).json({
    success: true,
    jobs,
    jobsCount,
    filteredJobsCount,
    resultPerPage: RESULT_PER_PAGE,
  });
});

// Get single job
export const getJobDetails = catchAsyncError(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate(
    "employer",
    "companyName description website avatar address"
  );
  if (!job) return next(new ErrorHandler("Job not found", 404));
  res.status(200).json({ success: true, job });
});

// Jobs posted by current recruiter
export const getMyJobs = catchAsyncError(async (req, res) => {
  const jobs = await Job.find({ employer: req.user.id }).sort("-createdAt");
  res.status(200).json({ success: true, jobs });
});

// Toggle save/unsave a job — Student
export const toggleSaveJob = catchAsyncError(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new ErrorHandler("Job not found", 404));

  const user = await User.findById(req.user.id);
  const already = user.savedJobs.some((j) => j.toString() === job.id);

  if (already) {
    user.savedJobs.pull(job._id);
  } else {
    user.savedJobs.addToSet(job._id);
  }
  await user.save();

  res.status(200).json({
    success: true,
    saved: !already,
    message: already ? "Job removed from saved" : "Job saved",
  });
});

// List saved jobs — Student
export const getSavedJobs = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "savedJobs",
    populate: { path: "employer", select: "companyName avatar" },
  });
  res.status(200).json({ success: true, jobs: user.savedJobs });
});
