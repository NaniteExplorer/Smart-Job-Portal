import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";

// Load env before anything that reads it.
dotenv.config({ path: "backend/config/config.env" });

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import errorMiddleware from "./middleware/error.js";

const app = express();

// ── Security & hardening ──────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:3000").split(","),
    credentials: true,
  })
);

// ── Parsers ───────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap on uploads
    abortOnLimit: true,
    useTempFiles: false,
  })
);

// ── Sanitisation ──────────────────────────────────────────
app.use(mongoSanitize());
app.use(hpp());

// ── Misc ──────────────────────────────────────────────────
app.use(compression());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Global rate limit (auth routes get a stricter one of their own).
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ── Health check ──────────────────────────────────────────
app.get("/api/v1/health", (req, res) =>
  res.status(200).json({ success: true, status: "ok", service: "NexHire API" })
);

// ── Routes ────────────────────────────────────────────────
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", jobRoutes);
app.use("/api/v1", applicationRoutes);
app.use("/api/v1", eventRoutes);

// ── 404 + error handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
app.use(errorMiddleware);

export default app;
