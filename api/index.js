// Vercel serverless entry point.
// Unlike server.js (which calls app.listen for local/long-lived hosting),
// this module exports the Express app so Vercel can invoke it per-request.
// The Mongoose connection is cached across warm invocations to avoid
// exhausting the MongoDB connection pool.

import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });

import mongoose from "mongoose";
import cloudinary from "cloudinary";
import app from "../backend/app.js";

// Validate required env vars at cold start — fail loud.
const required = ["DB_URI", "JWT_SECRET"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cache the connection on the module scope. Warm invocations reuse it;
// cold starts establish a fresh one.
let connectionPromise = null;
const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.DB_URI, {
      // Keep the pool small — many concurrent functions each hold a pool.
      maxPoolSize: 5,
    });
  }
  return connectionPromise;
};

// Ensure the DB is connected before handling any request.
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
