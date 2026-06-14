import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiUsers,
  FiCalendar,
  FiGlobe,
  FiBookmark,
  FiSearch,
  FiExternalLink,
} from "react-icons/fi";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Avatar from "../shared/Avatar";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { fetchJobDetails, toggleSaveJob } from "../../store/jobSlice";
import { applyForJob } from "../../store/applicationSlice";
import { formatSalary, formatDate, timeAgo } from "../../utils/format";

const savedIdSet = (savedJobs = []) =>
  new Set(savedJobs.map((j) => (typeof j === "string" ? j : j?._id)).filter(Boolean));

const appliedIdSet = (appliedJobs = []) =>
  new Set(appliedJobs.map((j) => (typeof j === "string" ? j : j?._id || j?.job?._id)).filter(Boolean));

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { job, loading } = useSelector((s) => s.jobs);
  const { loading: applyLoading } = useSelector((s) => s.applications);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const isStudent = user?.role === "student";

  const [coverOpen, setCoverOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchJobDetails(id));
  }, [dispatch, id]);

  // seed saved / applied state from the user object
  useEffect(() => {
    setSaved(savedIdSet(user?.savedJobs).has(id));
    setApplied(appliedIdSet(user?.appliedJobs).has(id));
  }, [user, id]);

  const handleSave = async () => {
    try {
      const { saved: now } = await dispatch(toggleSaveJob(id)).unwrap();
      setSaved(now);
      toast.success(now ? "Job saved" : "Removed from saved");
    } catch (err) {
      toast.error(err || "Could not update saved jobs");
    }
  };

  const handleApply = async () => {
    try {
      await dispatch(applyForJob({ jobId: id, coverLetter })).unwrap();
      setApplied(true);
      setCoverOpen(false);
      toast.success("Application submitted");
    } catch (err) {
      toast.error(err || "Could not submit application");
    }
  };

  if (loading) return <Loader />;

  if (!job) {
    return (
      <div className="container-px py-10">
        <MetaData title="Job not found" />
        <EmptyState
          icon={FiSearch}
          title="Job not found"
          message="This job may have been removed or the link is incorrect."
          actionLabel="Browse jobs"
          actionTo="/jobs"
        />
      </div>
    );
  }

  const company = job.employer?.companyName || "Company";
  const chips = [
    job.jobType,
    job.experienceLevel,
    job.location,
    formatSalary(job.salaryMin, job.salaryMax),
  ].filter(Boolean);

  return (
    <div className="container-px py-8">
      <MetaData title={job.title} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* ---------- Main column ---------- */}
        <div className="space-y-6">
          {/* Header card */}
          <div className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <Avatar url={job.employer?.avatar?.url} name={company} size="lg" />
                <div>
                  <h1 className="text-2xl font-bold text-ink">{job.title}</h1>
                  <p className="mt-0.5 text-ink-soft">{company}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                    <FiClock /> Posted {timeAgo(job.createdAt)}
                  </p>
                </div>
              </div>
              {job.status && <StatusBadge status={job.status} />}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((c, i) => (
                <span key={`${c}-${i}`} className="chip">{c}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="card p-6">
              <h2 className="mb-3 text-lg font-semibold text-ink">About the role</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="card p-6">
              <h2 className="mb-3 text-lg font-semibold text-ink">Requirements</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="card p-6">
              <h2 className="mb-3 text-lg font-semibold text-ink">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Meta: openings + deadline */}
          <div className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <FiUsers />
              </span>
              <div>
                <p className="text-xs text-ink-muted">Openings</p>
                <p className="text-sm font-semibold text-ink">{job.openings ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <FiCalendar />
              </span>
              <div>
                <p className="text-xs text-ink-muted">Apply by</p>
                <p className="text-sm font-semibold text-ink">{formatDate(job.deadline)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Sidebar / aside ---------- */}
        <aside className="space-y-6">
          {/* Action card (sticky) */}
          <div className="card sticky top-24 p-6">
            {isStudent ? (
              <>
                {applied ? (
                  <button className="btn-primary w-full cursor-default opacity-70" disabled>
                    Applied
                  </button>
                ) : coverOpen ? (
                  <div className="space-y-3">
                    <label className="label" htmlFor="coverLetter">Cover letter</label>
                    <textarea
                      id="coverLetter"
                      rows={6}
                      className="input resize-none"
                      placeholder="Tell the recruiter why you're a great fit…"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleApply}
                        disabled={applyLoading}
                        className="btn-primary flex-1 disabled:opacity-60"
                      >
                        {applyLoading ? "Submitting…" : "Submit application"}
                      </button>
                      <button
                        onClick={() => setCoverOpen(false)}
                        disabled={applyLoading}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setCoverOpen(true)} className="btn-primary w-full">
                    Apply Now
                  </button>
                )}

                <button
                  onClick={handleSave}
                  className="btn-outline mt-3 inline-flex w-full items-center justify-center gap-2"
                >
                  <FiBookmark fill={saved ? "currentColor" : "none"} />
                  {saved ? "Saved" : "Save job"}
                </button>
              </>
            ) : !isAuthenticated ? (
              <Link to="/login" className="btn-primary w-full text-center">
                Sign in to apply
              </Link>
            ) : (
              <p className="text-center text-sm text-ink-muted">
                Applications are open to students.
              </p>
            )}
          </div>

          {/* Company info card */}
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <Avatar url={job.employer?.avatar?.url} name={company} size="md" />
              <div>
                <p className="font-semibold text-ink">{company}</p>
                {job.employer?.address && (
                  <p className="flex items-center gap-1 text-xs text-ink-muted">
                    <FiMapPin /> {job.employer.address}
                  </p>
                )}
              </div>
            </div>

            {job.employer?.description && (
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {job.employer.description}
              </p>
            )}

            {job.employer?.website && (
              <a
                href={job.employer.website}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
              >
                <FiGlobe /> Visit website
                <FiExternalLink className="text-xs" />
              </a>
            )}
          </div>

          <div className="card flex items-center gap-3 p-5">
            <FiBriefcase className="text-brand-500" />
            <span className="text-sm text-ink-soft">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetails;
