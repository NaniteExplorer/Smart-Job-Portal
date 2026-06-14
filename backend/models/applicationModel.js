import mongoose from "mongoose";

/**
 * Single source of truth for a student's application to a job.
 * Tracks the recruiter's review pipeline status.
 */
const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Shortlisted", "Interviewed", "Offered", "Rejected"],
      default: "Applied",
    },
    coverLetter: { type: String, maxlength: 3000 },
  },
  { timestamps: true }
);

// A student can apply to a given job only once.
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
