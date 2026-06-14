import express from "express";
import {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getJobApplicants,
  getReceivedApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";
import { ROLES } from "../models/userModel.js";

const router = express.Router();

// Student
router.post("/jobs/:jobId/apply", isAuthenticated, authorizeRoles(ROLES.STUDENT), applyForJob);
router.get("/applications/me", isAuthenticated, authorizeRoles(ROLES.STUDENT), getMyApplications);
router.delete("/applications/:id", isAuthenticated, authorizeRoles(ROLES.STUDENT), withdrawApplication);

// Recruiter
router.get("/applications/received", isAuthenticated, authorizeRoles(ROLES.RECRUITER), getReceivedApplications);
router.get("/jobs/:jobId/applicants", isAuthenticated, authorizeRoles(ROLES.RECRUITER), getJobApplicants);
router.put("/applications/:id/status", isAuthenticated, authorizeRoles(ROLES.RECRUITER), updateApplicationStatus);

export default router;
