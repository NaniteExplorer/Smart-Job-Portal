import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });

import app from "./app.js";
import ConnectDatabase from "./config/database.js";
import cloudinary from "cloudinary";

// Crash early on programmer errors.
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error("Shutting down due to uncaught exception");
  process.exit(1);
});

// Validate required env vars at boot — fail loud, not at request time.
const required = ["DB_URI", "JWT_SECRET"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

ConnectDatabase();

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`NexHire API running on http://localhost:${PORT}`);
});

// Graceful shutdown on unhandled promise rejections.
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
