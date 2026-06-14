import express from "express";
import {
  getMyProfile,
  getPublicProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
  getDashboard,
  searchUsers,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/users/search", searchUsers);
router.get("/me", isAuthenticated, getMyProfile);
router.get("/dashboard", isAuthenticated, getDashboard);
router.put("/me/update", isAuthenticated, updateProfile);
router.put("/me/password", isAuthenticated, updatePassword);
router.delete("/me", isAuthenticated, deleteAccount);
router.get("/users/:id", getPublicProfile);

export default router;
