import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventDetails,
  toggleRegisterEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import { ROLES } from "../models/userModel.js";

const router = express.Router();

// Public
router.get("/events", getAllEvents);

// Host (recruiter or university)
const HOSTS = [ROLES.RECRUITER, ROLES.UNIVERSITY];
router.get("/events/hosted", isAuthenticated, authorizeRoles(...HOSTS), getMyEvents);
router.post("/events", isAuthenticated, authorizeRoles(...HOSTS), createEvent);
router.put("/events/:id", isAuthenticated, authorizeRoles(...HOSTS), updateEvent);
router.delete("/events/:id", isAuthenticated, authorizeRoles(...HOSTS), deleteEvent);

// Student
router.put("/events/:id/register", isAuthenticated, authorizeRoles(ROLES.STUDENT), toggleRegisterEvent);

// Public detail (last)
router.get("/events/:id", getEventDetails);

export default router;
