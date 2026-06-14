import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiPlus,
  FiMapPin,
  FiUsers,
  FiClock,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { fetchMyJobs, deleteJob } from "../../store/jobSlice";
import { timeAgo } from "../../utils/format";

const ManageJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myJobs, loading } = useSelector((s) => s.jobs);

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await dispatch(deleteJob(id)).unwrap();
      toast.success("Job deleted");
    } catch (err) {
      toast.error(err || "Could not delete job");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container-px py-8">
      <MetaData title="Manage Jobs" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Manage Jobs</h1>
          <p className="mt-1 text-sm text-ink-muted">
            View, edit, and track applicants for your postings.
          </p>
        </div>
        <button
          onClick={() => navigate("/recruiter/jobs/new")}
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <FiPlus /> Post New Job
        </button>
      </div>

      {/* List */}
      {!myJobs || myJobs.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FiBriefcase}
            title="No jobs posted"
            message="Post your first job to start receiving applicants."
            actionLabel="Post a Job"
            actionTo="/recruiter/jobs/new"
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {myJobs.map((job) => {
            const applicantCount = job.applicants?.length ?? 0;
            return (
              <div key={job._id} className="card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="truncate text-lg font-semibold text-ink">
                        {job.title}
                      </h2>
                      {job.status && <StatusBadge status={job.status} />}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-muted">
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <FiMapPin className="text-brand-500" /> {job.location}
                        </span>
                      )}
                      {job.jobType && (
                        <span className="inline-flex items-center gap-1.5">
                          <FiBriefcase className="text-brand-500" /> {job.jobType}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <FiUsers className="text-brand-500" /> {applicantCount}{" "}
                        applicant{applicantCount === 1 ? "" : "s"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FiClock className="text-brand-500" /> Posted{" "}
                        {timeAgo(job.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      className="btn-outline inline-flex items-center gap-1.5"
                    >
                      <FiEye /> View Applicants
                    </Link>
                    <Link
                      to={`/recruiter/jobs/${job._id}/edit`}
                      className="btn-ghost inline-flex items-center gap-1.5"
                    >
                      <FiEdit2 /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id, job.title)}
                      className="btn-ghost inline-flex items-center gap-1.5 text-rose-600 hover:bg-rose-50"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
