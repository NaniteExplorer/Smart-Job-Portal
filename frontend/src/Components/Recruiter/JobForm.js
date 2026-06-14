import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiBriefcase } from "react-icons/fi";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { fetchJobDetails, createJob, updateJob } from "../../store/jobSlice";

const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"];
const EXPERIENCE_LEVELS = ["Fresher", "Entry", "Mid", "Senior", "Lead"];
const STATUSES = ["Open", "Closed"];

const EMPTY_FORM = {
  title: "",
  description: "",
  location: "",
  jobType: "Full-Time",
  experienceLevel: "Fresher",
  salaryMin: "",
  salaryMax: "",
  skills: "",
  requirements: "",
  openings: "",
  deadline: "",
  status: "Open",
};

const JobForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { job, loading, actionLoading } = useSelector((s) => s.jobs);
  const [form, setForm] = useState(EMPTY_FORM);

  // Load existing job in edit mode
  useEffect(() => {
    if (isEdit) dispatch(fetchJobDetails(id));
  }, [dispatch, id, isEdit]);

  // Prefill form once the job arrives
  useEffect(() => {
    if (isEdit && job && job._id === id) {
      setForm({
        title: job.title || "",
        description: job.description || "",
        location: job.location || "",
        jobType: job.jobType || "Full-Time",
        experienceLevel: job.experienceLevel || "Fresher",
        salaryMin: job.salaryMin ?? "",
        salaryMax: job.salaryMax ?? "",
        skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
        requirements: job.requirements || "",
        openings: job.openings ?? "",
        deadline: job.deadline ? job.deadline.slice(0, 10) : "",
        status: job.status || "Open",
      });
    }
  }, [job, id, isEdit]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      toast.error("Title, description and location are required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      jobType: form.jobType,
      experienceLevel: form.experienceLevel,
      salaryMin: form.salaryMin === "" ? undefined : Number(form.salaryMin),
      salaryMax: form.salaryMax === "" ? undefined : Number(form.salaryMax),
      skills: form.skills,
      requirements: form.requirements.trim(),
      openings: form.openings === "" ? undefined : Number(form.openings),
      deadline: form.deadline || undefined,
    };
    if (isEdit) payload.status = form.status;

    try {
      if (isEdit) {
        await dispatch(updateJob({ id, payload })).unwrap();
        toast.success("Job updated");
      } else {
        await dispatch(createJob(payload)).unwrap();
        toast.success("Job posted");
      }
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(err || "Could not save job");
    }
  };

  if (isEdit && loading && (!job || job._id !== id)) return <Loader />;

  return (
    <div className="container-px py-8">
      <MetaData title={isEdit ? "Edit Job" : "Post a Job"} />

      <Link
        to="/recruiter/jobs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
      >
        <FiArrowLeft /> Back to Manage Jobs
      </Link>

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <FiBriefcase size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {isEdit ? "Edit Job" : "Post a New Job"}
          </h1>
          <p className="text-sm text-ink-muted">
            {isEdit
              ? "Update the details for this posting."
              : "Fill in the details to publish your job opening."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 max-w-3xl space-y-6">
        {/* Core details */}
        <div className="card space-y-5 p-6">
          <div>
            <label className="label" htmlFor="title">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              className="input"
              placeholder="e.g. Frontend Engineer"
              value={form.title}
              onChange={update("title")}
            />
          </div>

          <div>
            <label className="label" htmlFor="description">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              rows={6}
              className="input resize-none"
              placeholder="Describe the role, responsibilities and team…"
              value={form.description}
              onChange={update("description")}
            />
          </div>

          <div>
            <label className="label" htmlFor="location">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              id="location"
              className="input"
              placeholder="e.g. Bengaluru, India"
              value={form.location}
              onChange={update("location")}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="jobType">
                Job Type
              </label>
              <select
                id="jobType"
                className="input"
                value={form.jobType}
                onChange={update("jobType")}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="experienceLevel">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                className="input"
                value={form.experienceLevel}
                onChange={update("experienceLevel")}
              >
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Compensation & logistics */}
        <div className="card space-y-5 p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="salaryMin">
                Salary (Min)
              </label>
              <input
                id="salaryMin"
                type="number"
                min="0"
                className="input"
                placeholder="e.g. 600000"
                value={form.salaryMin}
                onChange={update("salaryMin")}
              />
            </div>
            <div>
              <label className="label" htmlFor="salaryMax">
                Salary (Max)
              </label>
              <input
                id="salaryMax"
                type="number"
                min="0"
                className="input"
                placeholder="e.g. 1200000"
                value={form.salaryMax}
                onChange={update("salaryMax")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="openings">
                Openings
              </label>
              <input
                id="openings"
                type="number"
                min="1"
                className="input"
                placeholder="e.g. 3"
                value={form.openings}
                onChange={update("openings")}
              />
            </div>
            <div>
              <label className="label" htmlFor="deadline">
                Application Deadline
              </label>
              <input
                id="deadline"
                type="date"
                className="input"
                value={form.deadline}
                onChange={update("deadline")}
              />
            </div>
          </div>

          {isEdit && (
            <div className="sm:max-w-xs">
              <label className="label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="input"
                value={form.status}
                onChange={update("status")}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Skills & requirements */}
        <div className="card space-y-5 p-6">
          <div>
            <label className="label" htmlFor="skills">
              Skills
            </label>
            <input
              id="skills"
              className="input"
              placeholder="Comma separated, e.g. React, TypeScript, Node.js"
              value={form.skills}
              onChange={update("skills")}
            />
            <p className="mt-1 text-xs text-ink-muted">
              Separate skills with commas.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="requirements">
              Requirements
            </label>
            <textarea
              id="requirements"
              rows={5}
              className="input resize-none"
              placeholder="Qualifications, experience and must-haves…"
              value={form.requirements}
              onChange={update("requirements")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={actionLoading}
            className="btn-primary disabled:opacity-60"
          >
            {actionLoading
              ? "Saving…"
              : isEdit
              ? "Save Changes"
              : "Post Job"}
          </button>
          <Link to="/recruiter/jobs" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
