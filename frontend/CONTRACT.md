# NexHire Frontend Contract (for component authors)

Design system: **Tailwind only** (no Bootstrap/MUI). Professional-blue, LinkedIn-like.
Brand color = `brand-{50..950}` (brand-600 primary). Text = `ink`, `ink-soft`, `ink-muted`.
Reusable CSS classes (in index.css): `btn-primary`, `btn-outline`, `btn-ghost`, `input`, `label`, `card`, `chip`, `container-px`.
Fonts: Inter (already loaded). Icons: `react-icons/fi` (Feather) and `react-icons/fa`.
Toasts: `import toast from "react-hot-toast"` → `toast.success(...)`, `toast.error(...)`.

## Reusable components (import and USE these — do not recreate)
- `../layout/MetaData` → `<MetaData title="..." />`
- `../layout/Loader` → `<Loader />`
- `../shared/Avatar` → `<Avatar url={} name={} size="sm|md|lg|xl" />`
- `../shared/StatusBadge` → `<StatusBadge status="Applied" />`
- `../shared/EmptyState` → `<EmptyState icon={FiX} title message actionLabel actionTo />`
- `../shared/JobCard` → `<JobCard job={} saved={bool} showSave onToggleSave={fn} />`
- `../shared/EventCard` → `<EventCard event={} />`
- `../shared/Logo` → `<Logo light={bool} />`
- utils `../../utils/format`: `formatSalary(min,max)`, `formatDate(d)`, `timeAgo(d)`, `displayName(user)`, `initials(name)`

## Redux store shape
`useSelector((s) => s.auth)` → `{ user, isAuthenticated, loading, error, initialized }`
`useSelector((s) => s.jobs)` → `{ jobs, job, myJobs, savedJobs, jobsCount, filteredJobsCount, resultPerPage, loading, error, actionLoading, message }`
`useSelector((s) => s.applications)` → `{ myApplications, received, applicants, applicantsJob, loading, error, message }`
`useSelector((s) => s.events)` → `{ events, event, myEvents, loading, error, message, actionLoading }`

## Thunks (import from these files; all return promises, use `.unwrap()` to catch)
auth (`../../store/authSlice`): `login({email,password})`, `register(payload)`, `loadUser()`, `updateProfile(payload)`, `updatePassword({oldPassword,newPassword,confirmPassword})`, `logout()`, `deleteAccount()`, `clearAuthError()`
jobs (`../../store/jobSlice`): `fetchJobs(queryString)`, `fetchJobDetails(id)`, `createJob(payload)`, `updateJob({id,payload})`, `deleteJob(id)`, `fetchMyJobs()`, `toggleSaveJob(id)`, `fetchSavedJobs()`
applications (`../../store/applicationSlice`): `applyForJob({jobId,coverLetter})`, `fetchMyApplications()`, `withdrawApplication(id)`, `fetchReceivedApplications()`, `fetchJobApplicants(jobId)`, `updateApplicationStatus({id,status})`
events (`../../store/eventSlice`): `fetchEvents(queryString)`, `fetchEventDetails(id)`, `createEvent(payload)`, `fetchMyEvents()`, `toggleRegisterEvent(id)`, `deleteEvent(id)`

## User object fields
Common: `_id, role ("student"|"recruiter"|"university"), email, avatar:{url}, phone, bio`
Student: `firstName, lastName, university (populated {name,address,website}), degree, major, graduationYear, skills:[], resume:{url}, appliedJobs:[], savedJobs:[]`
Recruiter: `companyName, address, description, website, jobsPosted:[]`
University: `name, address, description, website, students:[]`

## Job object
`_id, title, description, location, jobType ("Full-Time"|"Part-Time"|"Internship"|"Contract"|"Remote"), experienceLevel ("Fresher"|"Entry"|"Mid"|"Senior"|"Lead"), salaryMin, salaryMax, skills:[], requirements, openings, deadline, status ("Open"|"Closed"), employer (populated {companyName,avatar,description,website,address}), applicants:[], createdAt`

## Application object
`_id, student (populated), job (populated {title,location,jobType,status,employer}), employer, status ("Applied"|"Reviewed"|"Shortlisted"|"Interviewed"|"Offered"|"Rejected"), coverLetter, createdAt`

## Event object
`_id, title, description, category ("Hackathon"|"Contest"|"Workshop"|"Webinar"|"Fest"|"Conference"), mode ("Online"|"Offline"|"Hybrid"), location, banner:{url}, tags:[], prizePool, teamSize, registrationDeadline, startDate, endDate, status ("Upcoming"|"Ongoing"|"Completed"), host (populated {companyName,name,avatar,website}), participants:[], createdAt`

## Query strings for fetchJobs
`keyword=`, `jobType=`, `location=`, `experienceLevel=`, `salaryMin[gte]=`, `page=`. Pagination uses `resultPerPage` from store; total pages = Math.ceil(filteredJobsCount/resultPerPage).
For fetchEvents: `keyword=`, `category=`, `status=`.

## Conventions
- Every page wraps content in `<div className="container-px py-8|py-10">` and includes `<MetaData title=.. />`.
- Show `<Loader />` while `loading`. Use `EmptyState` for empty lists.
- On thunk error, `toast.error(err)`. After successful mutation, `toast.success(...)`.
- Use `useNavigate`, `useParams`, `Link` from react-router-dom (v6).
- Default export the component.
