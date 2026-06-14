import mongoose from "mongoose";

/**
 * Hackathons, contests, workshops and fests — the "Unstop" pillar of NexHire.
 * Hosted by recruiters or universities, joined by students.
 */
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Event title is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    category: {
      type: String,
      enum: ["Hackathon", "Contest", "Workshop", "Webinar", "Fest", "Conference"],
      default: "Hackathon",
    },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online",
    },
    location: { type: String, trim: true },
    banner: {
      public_id: { type: String },
      url: { type: String },
    },
    tags: { type: [String], default: [] },
    prizePool: { type: Number, default: 0 },
    teamSize: { type: Number, default: 1, min: 1 },
    registrationDeadline: { type: Date },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
      index: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

eventSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("Event", eventSchema);
