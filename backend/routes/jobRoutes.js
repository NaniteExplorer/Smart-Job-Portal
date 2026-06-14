import express from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobDetails,
  getMyJobs,
  toggleSaveJob,
  getSavedJobs,
} from "../controllers/jobController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import { ROLES } from "../models/userModel.js";

const router = express.Router();

// Public
router.get("/jobs", getAllJobs);

// Student — saved jobs (declared before /jobs/:id so it isn't shadowed)
router.get("/jobs/saved", isAuthenticated, authorizeRoles(ROLES.STUDENT), getSavedJobs);
router.put("/jobs/:id/save", isAuthenticated, authorizeRoles(ROLES.STUDENT), toggleSaveJob);

// Recruiter
router.get("/recruiter/jobs", isAuthenticated, authorizeRoles(ROLES.RECRUITER), getMyJobs);
router.post("/jobs", isAuthenticated, authorizeRoles(ROLES.RECRUITER), createJob);
router.put("/jobs/:id", isAuthenticated, authorizeRoles(ROLES.RECRUITER), updateJob);
router.delete("/jobs/:id", isAuthenticated, authorizeRoles(ROLES.RECRUITER), deleteJob);

// Public detail (last, so specific routes above win)
router.get("/jobs/:id", getJobDetails);

export default router;
