import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * Unified user model for all three roles.
 *
 * NexHire has three actors — students, recruiters and universities — but they
 * share the same auth surface (email/password, JWT, password reset). Rather than
 * three near-identical models with duplicated logic, we use one schema and gate
 * role-specific fields behind a `role` discriminator field. This is the same
 * pattern LinkedIn/Naukri use and removes ~70% of the original code duplication.
 */

export const ROLES = {
  STUDENT: "student",
  RECRUITER: "recruiter",
  UNIVERSITY: "university",
};

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: [true, "Role is required"],
      index: true,
    },

    // ── Common ──────────────────────────────────────────────
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: { type: String },
      url: { type: String },
    },
    phone: { type: String, trim: true },
    bio: { type: String, maxlength: 1000 },

    // ── Student fields ──────────────────────────────────────
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    degree: { type: String, trim: true },
    major: { type: String, trim: true },
    graduationYear: { type: Number },
    skills: { type: [String], default: [] },
    resume: {
      public_id: { type: String },
      url: { type: String },
    },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // ── Recruiter / University (organisation) fields ────────
    companyName: { type: String, trim: true }, // recruiter
    name: { type: String, trim: true }, // university
    address: { type: String, trim: true },
    description: { type: String, maxlength: 2000 },
    website: { type: String, trim: true },
    jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // recruiter
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // university

    // ── Auth recovery ───────────────────────────────────────
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Hash password before save — only when it actually changed.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Friendly display name regardless of role.
userSchema.virtual("displayName").get(function () {
  if (this.role === ROLES.STUDENT) {
    return [this.firstName, this.lastName].filter(Boolean).join(" ");
  }
  if (this.role === ROLES.RECRUITER) return this.companyName;
  return this.name;
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", userSchema);
