import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });

import mongoose from "mongoose";
import User, { ROLES } from "../models/userModel.js";
import Job from "../models/jobModel.js";
import Event from "../models/eventModel.js";
import Application from "../models/applicationModel.js";

/**
 * Seeds NexHire with realistic demo data so the UI looks alive on first run.
 * Usage: npm run seed
 * Default password for every seeded account: Password123
 */

const run = async () => {
  await mongoose.connect(process.env.DB_URI);
  console.log("Connected. Wiping existing data…");
  await Promise.all([
    User.deleteMany({}),
    Job.deleteMany({}),
    Event.deleteMany({}),
    Application.deleteMany({}),
  ]);

  const PASS = "Password123";

  // Universities
  const nit = await User.create({
    role: ROLES.UNIVERSITY,
    name: "NIT Rourkela",
    email: "nitrkl@nexhire.dev",
    password: PASS,
    address: "Rourkela, Odisha, India",
    website: "https://nitrkl.ac.in",
    description: "National Institute of Technology, Rourkela — premier engineering institute.",
  });
  const iit = await User.create({
    role: ROLES.UNIVERSITY,
    name: "IIT Bombay",
    email: "iitb@nexhire.dev",
    password: PASS,
    address: "Mumbai, Maharashtra, India",
    website: "https://iitb.ac.in",
    description: "Indian Institute of Technology, Bombay.",
  });

  // Recruiters
  const acme = await User.create({
    role: ROLES.RECRUITER,
    companyName: "Acme Technologies",
    email: "hr@acme.dev",
    password: PASS,
    address: "Bengaluru, India",
    website: "https://acme.dev",
    description: "Building developer tools used by millions.",
  });
  const nova = await User.create({
    role: ROLES.RECRUITER,
    companyName: "Nova Labs",
    email: "talent@novalabs.dev",
    password: PASS,
    address: "Hyderabad, India",
    website: "https://novalabs.dev",
    description: "AI research and applied ML products.",
  });

  // Students
  const students = await User.create([
    {
      role: ROLES.STUDENT,
      firstName: "Aarav",
      lastName: "Sharma",
      email: "aarav@nexhire.dev",
      password: PASS,
      university: nit._id,
      degree: "B.Tech",
      major: "Computer Science",
      graduationYear: 2026,
      skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    },
    {
      role: ROLES.STUDENT,
      firstName: "Diya",
      lastName: "Patel",
      email: "diya@nexhire.dev",
      password: PASS,
      university: iit._id,
      degree: "B.Tech",
      major: "Electrical Engineering",
      graduationYear: 2025,
      skills: ["Python", "Machine Learning", "PyTorch"],
    },
  ]);
  await User.findByIdAndUpdate(nit._id, { $addToSet: { students: students[0]._id } });
  await User.findByIdAndUpdate(iit._id, { $addToSet: { students: students[1]._id } });

  // Jobs
  const jobsData = [
    {
      title: "Frontend Engineer (React)",
      description: "Build delightful UIs with React and TypeScript. Work closely with design.",
      location: "Bengaluru",
      jobType: "Full-Time",
      experienceLevel: "Entry",
      salaryMin: 800000,
      salaryMax: 1400000,
      skills: ["React", "TypeScript", "Tailwind CSS"],
      requirements: "Strong JS fundamentals, 0-2 yrs experience.",
      employer: acme._id,
    },
    {
      title: "Backend Developer (Node.js)",
      description: "Design and scale our REST APIs and data layer.",
      location: "Remote",
      jobType: "Remote",
      experienceLevel: "Mid",
      salaryMin: 1200000,
      salaryMax: 2000000,
      skills: ["Node.js", "MongoDB", "Express"],
      requirements: "Experience with distributed systems a plus.",
      employer: acme._id,
    },
    {
      title: "ML Research Intern",
      description: "Work on cutting-edge applied ML problems with our research team.",
      location: "Hyderabad",
      jobType: "Internship",
      experienceLevel: "Fresher",
      salaryMin: 40000,
      salaryMax: 60000,
      skills: ["Python", "PyTorch", "Machine Learning"],
      requirements: "Currently pursuing a degree in CS/EE.",
      employer: nova._id,
    },
    {
      title: "Full Stack Engineer",
      description: "Own features end-to-end across our MERN stack.",
      location: "Mumbai",
      jobType: "Full-Time",
      experienceLevel: "Mid",
      salaryMin: 1500000,
      salaryMax: 2500000,
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      requirements: "3+ years building web apps.",
      employer: nova._id,
    },
  ];
  const jobs = await Job.create(jobsData);
  await User.findByIdAndUpdate(acme._id, {
    $addToSet: { jobsPosted: { $each: [jobs[0]._id, jobs[1]._id] } },
  });
  await User.findByIdAndUpdate(nova._id, {
    $addToSet: { jobsPosted: { $each: [jobs[2]._id, jobs[3]._id] } },
  });

  // One sample application
  await Application.create({
    student: students[0]._id,
    job: jobs[0]._id,
    employer: acme._id,
    status: "Reviewed",
    coverLetter: "I'd love to contribute to your frontend team.",
  });
  await Job.findByIdAndUpdate(jobs[0]._id, { $addToSet: { applicants: students[0]._id } });
  await User.findByIdAndUpdate(students[0]._id, { $addToSet: { appliedJobs: jobs[0]._id } });

  // Events / hackathons
  await Event.create([
    {
      title: "NexHack 2026 — National Hackathon",
      description: "48 hours. Build something that matters. ₹5L prize pool across tracks.",
      category: "Hackathon",
      mode: "Hybrid",
      location: "Bengaluru + Online",
      tags: ["AI", "Web3", "Open Innovation"],
      prizePool: 500000,
      teamSize: 4,
      startDate: new Date("2026-09-15"),
      endDate: new Date("2026-09-17"),
      host: acme._id,
    },
    {
      title: "Campus to Code Workshop",
      description: "A hands-on workshop on system design for final-year students.",
      category: "Workshop",
      mode: "Online",
      tags: ["System Design", "Career"],
      teamSize: 1,
      startDate: new Date("2026-08-01"),
      host: iit._id,
    },
    {
      title: "AI Innovate Challenge",
      description: "Solve real industry ML problems and get hired on the spot.",
      category: "Contest",
      mode: "Online",
      tags: ["Machine Learning", "Hiring"],
      prizePool: 200000,
      teamSize: 2,
      startDate: new Date("2026-10-05"),
      host: nova._id,
    },
  ]);

  console.log("✓ Seed complete.");
  console.log("  Login with any of these (password: Password123):");
  console.log("    student:    aarav@nexhire.dev");
  console.log("    recruiter:  hr@acme.dev");
  console.log("    university: nitrkl@nexhire.dev");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
