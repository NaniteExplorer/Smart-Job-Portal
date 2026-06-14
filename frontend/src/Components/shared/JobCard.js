import { Link } from "react-router-dom";
import { FiMapPin, FiBriefcase, FiBookmark } from "react-icons/fi";
import Avatar from "./Avatar";
import { formatSalary, timeAgo } from "../../utils/format";

const JobCard = ({ job, saved, onToggleSave, showSave }) => {
  const company = job.employer?.companyName || "Company";
  return (
    <div className="card group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar url={job.employer?.avatar?.url} name={company} size="md" />
          <div>
            <Link to={`/jobs/${job._id}`} className="font-semibold text-ink hover:text-brand-700">
              {job.title}
            </Link>
            <p className="text-sm text-ink-muted">{company}</p>
          </div>
        </div>
        {showSave && (
          <button
            onClick={() => onToggleSave?.(job._id)}
            className={`rounded-full p-2 transition ${
              saved ? "text-brand-600" : "text-slate-300 hover:text-brand-500"
            }`}
            aria-label="Save job"
          >
            <FiBookmark fill={saved ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="chip">{job.jobType}</span>
        <span className="chip">{job.experienceLevel}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <FiMapPin className="text-brand-500" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiBriefcase className="text-brand-500" /> {formatSalary(job.salaryMin, job.salaryMax)}
        </span>
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((s) => (
            <span key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-ink-soft">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-ink-muted">{timeAgo(job.createdAt)}</span>
        <Link to={`/jobs/${job._id}`} className="text-sm font-semibold text-brand-700 hover:underline">
          View details →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
