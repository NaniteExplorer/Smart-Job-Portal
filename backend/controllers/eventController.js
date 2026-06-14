import Event from "../models/eventModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Fields a host may set. `host` and `participants` are server-controlled.
const EVENT_FIELDS = [
  "title",
  "description",
  "category",
  "mode",
  "location",
  "banner",
  "tags",
  "prizePool",
  "teamSize",
  "registrationDeadline",
  "startDate",
  "endDate",
  "status",
];

const pickEventFields = (body) => {
  const data = {};
  EVENT_FIELDS.forEach((f) => body[f] !== undefined && (data[f] = body[f]));
  return data;
};

// Create event — Recruiter or University
export const createEvent = catchAsyncError(async (req, res) => {
  const event = await Event.create({ ...pickEventFields(req.body), host: req.user.id });
  res.status(201).json({ success: true, event });
});

// List events with optional search/category filter
export const getAllEvents = catchAsyncError(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.keyword) {
    const safe = escapeRegex(req.query.keyword);
    filter.$or = [
      { title: { $regex: safe, $options: "i" } },
      { tags: { $regex: safe, $options: "i" } },
    ];
  }
  const events = await Event.find(filter)
    .populate("host", "companyName name avatar")
    .sort("-startDate");
  res.status(200).json({ success: true, events });
});

// Single event
export const getEventDetails = catchAsyncError(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate(
    "host",
    "companyName name avatar website"
  );
  if (!event) return next(new ErrorHandler("Event not found", 404));
  res.status(200).json({ success: true, event });
});

// Register / unregister — Student
export const toggleRegisterEvent = catchAsyncError(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new ErrorHandler("Event not found", 404));

  const already = event.participants.some((p) => p.toString() === req.user.id);
  if (already) {
    event.participants.pull(req.user.id);
  } else {
    event.participants.addToSet(req.user.id);
  }
  await event.save();
  res.status(200).json({
    success: true,
    registered: !already,
    message: already ? "Unregistered from event" : "Registered for event",
  });
});

// Events hosted by current user
export const getMyEvents = catchAsyncError(async (req, res) => {
  const events = await Event.find({ host: req.user.id }).sort("-createdAt");
  res.status(200).json({ success: true, events });
});

// Update event — host only
export const updateEvent = catchAsyncError(async (req, res, next) => {
  let event = await Event.findById(req.params.id);
  if (!event) return next(new ErrorHandler("Event not found", 404));
  if (event.host.toString() !== req.user.id) {
    return next(new ErrorHandler("Not authorized", 403));
  }
  event = await Event.findByIdAndUpdate(req.params.id, pickEventFields(req.body), {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, event });
});

// Delete event — host only
export const deleteEvent = catchAsyncError(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new ErrorHandler("Event not found", 404));
  if (event.host.toString() !== req.user.id) {
    return next(new ErrorHandler("Not authorized", 403));
  }
  await event.deleteOne();
  res.status(200).json({ success: true, message: "Event deleted" });
});
