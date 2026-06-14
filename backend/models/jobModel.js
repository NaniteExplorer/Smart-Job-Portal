import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Job title is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    location: { type: String, required: [true, "Location is required"], trim: true },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"],
      default: "Full-Time",
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher", "Entry", "Mid", "Senior", "Lead"],
      default: "Entry",
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    skills: { type: [String], default: [] },
    requirements: { type: String },
    openings: { type: Number, default: 1, min: 1 },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
      index: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    universityPreference: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Text index powers full-text search across the listing.
jobSchema.index({ title: "text", description: "text", skills: "text" });

export default mongoose.model("Job", jobSchema);
