import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";

const STATUSES = ["Applied", "Reviewed", "Shortlisted", "Interviewed", "Offered", "Rejected"];

// Apply for a job — Student
export const applyForJob = catchAsyncError(async (req, res, next) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return next(new ErrorHandler("Job not found", 404));
  if (job.status === "Closed") {
    return next(new ErrorHandler("This job is no longer accepting applications", 400));
  }

  const exists = await Application.findOne({ student: req.user.id, job: job._id });
  if (exists) return next(new ErrorHandler("You have already applied to this job", 409));

  const application = await Application.create({
    student: req.user.id,
    job: job._id,
    employer: job.employer,
    coverLetter: req.body.coverLetter,
  });

  await Job.findByIdAndUpdate(job._id, { $addToSet: { applicants: req.user.id } });
  await User.findByIdAndUpdate(req.user.id, { $addToSet: { appliedJobs: job._id } });

  res.status(201).json({ success: true, application, message: "Application submitted" });
});

// My applications — Student
export const getMyApplications = catchAsyncError(async (req, res) => {
  const applications = await Application.find({ student: req.user.id })
    .populate({ path: "job", select: "title location jobType status", populate: { path: "employer", select: "companyName avatar" } })
    .sort("-createdAt");
  res.status(200).json({ success: true, applications });
});

// Withdraw an application — Student
export const withdrawApplication = catchAsyncError(async (req, res, next) => {
  const application = await Application.findById(req.params.id);
  if (!application) return next(new ErrorHandler("Application not found", 404));
  if (application.student.toString() !== req.user.id) {
    return next(new ErrorHandler("Not authorized", 403));
  }
  await Job.findByIdAndUpdate(application.job, { $pull: { applicants: req.user.id } });
  await User.findByIdAndUpdate(req.user.id, { $pull: { appliedJobs: application.job } });
  await application.deleteOne();
  res.status(200).json({ success: true, message: "Application withdrawn" });
});

// Applicants for a specific job — Recruiter (owner only)
export const getJobApplicants = catchAsyncError(async (req, res, next) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return next(new ErrorHandler("Job not found", 404));
  if (job.employer.toString() !== req.user.id) {
    return next(new ErrorHandler("Not authorized", 403));
  }
  const applications = await Application.find({ job: job._id })
    .populate("student", "firstName lastName email major degree skills avatar resume university")
    .sort("-createdAt");
  res.status(200).json({ success: true, job: { id: job._id, title: job.title }, applications });
});

// All applications across a recruiter's jobs — Recruiter
export const getReceivedApplications = catchAsyncError(async (req, res) => {
  const applications = await Application.find({ employer: req.user.id })
    .populate("student", "firstName lastName email major avatar")
    .populate("job", "title")
    .sort("-createdAt");
  res.status(200).json({ success: true, applications });
});

// Update application status — Recruiter (owner only)
export const updateApplicationStatus = catchAsyncError(async (req, res, next) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }
  const application = await Application.findById(req.params.id);
  if (!application) return next(new ErrorHandler("Application not found", 404));
  if (application.employer.toString() !== req.user.id) {
    return next(new ErrorHandler("Not authorized", 403));
  }
  application.status = status;
  await application.save();
  res.status(200).json({ success: true, application });
});
