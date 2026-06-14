# NexHire — Bridge Talent, Campus & Hiring

NexHire is a campus-to-career platform built on the MERN stack. It connects three
audiences in one place — **students**, **colleges/universities**, and **recruiters** —
combining the job-search of Naukri/LinkedIn with the hackathons-and-events energy of Unstop.

## Features

### For Students
- Create a profile (degree, major, skills, resume) and apply to jobs in one click
- Track every application through a status pipeline (Applied → Reviewed → Shortlisted → Interviewed → Offered/Rejected)
- Save jobs to revisit later
- Register for hackathons, contests and workshops
- Personal dashboard with stats and recent activity

### For Recruiters
- Post, edit and close job listings
- View applicants per job and move them through the hiring pipeline
- Host hackathons and events
- Recruiter dashboard with hiring metrics

### For Universities / Colleges
- Maintain a roster of affiliated students
- Host workshops, fests and conferences
- University dashboard

### Platform
- **One unified auth surface** — a single `User` model with a `role` field, one JWT auth middleware, role-based authorization
- Full-text job search with filters (type, location, experience, salary) and pagination
- Hardened API: Helmet, CORS, rate limiting, input sanitisation (mongo-sanitize + hpp), request size limits, file-upload caps
- httpOnly cookie auth with `secure`/`sameSite` in production

## Tech Stack

- **Frontend:** React 18, Redux Toolkit, React Router 6, Tailwind CSS, react-hot-toast
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Media:** Cloudinary (uploads)

## Getting Started

### Prerequisites
- Node.js 18+
- A running MongoDB instance

### Setup

```bash
# 1. Backend env
cp backend/config/config.env.example backend/config/config.env
#    then fill in DB_URI, JWT_SECRET, and Cloudinary keys

# 2. Install dependencies
npm install                 # backend (run from repo root)
cd frontend && npm install  # frontend

# 3. Seed demo data (optional but recommended)
cd .. && npm run seed
#    Demo logins (password: Password123):
#      student:    aarav@nexhire.dev
#      recruiter:  hr@acme.dev
#      university: nitrkl@nexhire.dev

# 4. Run
npm run dev                 # backend on :4000  (repo root)
cd frontend && npm start    # frontend on :3000 (proxies /api to :4000)
```

## Security notes

- `backend/config/config.env` is gitignored — never commit real secrets.
- If you cloned a version where secrets were previously committed, **rotate the JWT
  secret and Cloudinary keys**; old values remain in git history.

## API overview

Base path: `/api/v1`

| Area | Endpoints |
|------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/logout` |
| User | `GET /me`, `PUT /me/update`, `PUT /me/password`, `DELETE /me`, `GET /dashboard`, `GET /users/:id` |
| Jobs | `GET /jobs`, `GET /jobs/:id`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id`, `GET /recruiter/jobs`, `PUT /jobs/:id/save`, `GET /jobs/saved` |
| Applications | `POST /jobs/:jobId/apply`, `GET /applications/me`, `DELETE /applications/:id`, `GET /applications/received`, `GET /jobs/:jobId/applicants`, `PUT /applications/:id/status` |
| Events | `GET /events`, `GET /events/:id`, `POST /events`, `PUT /events/:id`, `DELETE /events/:id`, `GET /events/hosted`, `PUT /events/:id/register` |
