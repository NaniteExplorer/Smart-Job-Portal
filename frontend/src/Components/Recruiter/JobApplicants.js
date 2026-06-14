import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  FiUsers,
  FiArrowLeft,
  FiMail,
  FiBook,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Avatar from "../shared/Avatar";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { fetchJobApplicants, updateApplicationStatus } from "../../store/applicationSlice";
import { timeAgo } from "../../utils/format";

const STATUS_OPTIONS = [
  "Applied",
  "Reviewed",
  "Shortlisted",
  "Interviewed",
  "Offered",
  "Rejected",
];

const ApplicantCard = ({ application }) => {
  const dispatch = useDispatch();
  const [coverOpen, setCoverOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const student = application.student || {};
  const name = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Applicant";
  const study = [student.degree, student.major].filter(Boolean).join(" · ");

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    if (status === application.status) return;
    setUpdating(true);
    try {
      await dispatch(updateApplicationStatus({ id: application._id, status })).unwrap();
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error(err || "Could not update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Student details */}
        <div className="flex min-w-0 items-start gap-4">
          <Avatar url={student.avatar?.url} name={name} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg font-semibold text-ink">{name}</h3>
              <StatusBadge status={application.status} />
            </div>

            <div className="mt-1.5 space-y-1 text-sm text-ink-muted">
              {student.email && (
                <p className="flex items-center gap-1.5">
                  <FiMail className="text-brand-500" />
                  <a
                    href={`mailto:${student.email}`}
                    className="hover:text-brand-700 hover:underline"
                  >
                    {student.email}
                  </a>
                </p>
              )}
              {study && (
                <p className="flex items-center gap-1.5">
                  <FiBook className="text-brand-500" /> {study}
                </p>
              )}
            </div>

            {student.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {student.skills.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-3 text-xs text-ink-muted">
              Applied {timeAgo(application.createdAt)}
            </p>
          </div>
        </div>

        {/* Status control + resume */}
        <div className="flex flex-shrink-0 flex-col gap-2 sm:items-end">
          <select
            className="input sm:w-44"
            value={application.status}
            disabled={updating}
            onChange={handleStatusChange}
            aria-label="Update application status"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {student.resume?.url && (
            <a
              href={student.resume.url}
              target="_blank"
              rel="noreferrer"
              className="btn-outline inline-flex items-center justify-center gap-1.5"
            >
              <FiFileText /> View Résumé
            </a>
          )}
        </div>
      </div>

      {/* Cover letter (collapsible) */}
      {application.coverLetter && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setCoverOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
          >
            {coverOpen ? <FiChevronUp /> : <FiChevronDown />}
            {coverOpen ? "Hide cover letter" : "Show cover letter"}
          </button>
          {coverOpen && (
            <p className="mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-ink-soft">
              {application.coverLetter}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const JobApplicants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { applicants, applicantsJob, loading } = useSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchJobApplicants(id));
  }, [dispatch, id]);

  if (loading) return <Loader />;

  return (
    <div className="container-px py-8">
      <MetaData title={`Applicants${applicantsJob?.title ? ` · ${applicantsJob.title}` : ""}`} />

      <Link
        to="/recruiter/jobs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
      >
        <FiArrowLeft /> Back to Manage Jobs
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">
          Applicants for {applicantsJob?.title || "this job"}
        </h1>
        {applicants?.length > 0 && (
          <span className="chip">
            {applicants.length} applicant{applicants.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {!applicants || applicants.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FiUsers}
            title="No applicants yet"
            message="When students apply to this job, they'll appear here."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {applicants.map((application) => (
            <ApplicantCard key={application._id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
