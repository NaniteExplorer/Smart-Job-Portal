import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiFileText, FiMapPin, FiBriefcase, FiClock, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import EmptyState from "../shared/EmptyState";
import StatusBadge from "../shared/StatusBadge";
import { fetchMyApplications, withdrawApplication } from "../../store/applicationSlice";
import { timeAgo } from "../../utils/format";

const STATUSES = ["Applied", "Reviewed", "Shortlisted", "Interviewed", "Offered", "Rejected"];

const MyApplications = () => {
  const dispatch = useDispatch();
  const { myApplications, loading } = useSelector((s) => s.applications);

  const [filter, setFilter] = useState("All");
  const [withdrawingId, setWithdrawingId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const visible = useMemo(() => {
    if (filter === "All") return myApplications;
    return myApplications.filter((a) => a.status === filter);
  }, [myApplications, filter]);

  const handleWithdraw = async (id) => {
    if (!window.confirm("Withdraw this application? This cannot be undone.")) return;
    setWithdrawingId(id);
    try {
      await dispatch(withdrawApplication(id)).unwrap();
      toast.success("Application withdrawn");
    } catch (err) {
      toast.error(err || "Could not withdraw application");
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="container-px py-8">
      <MetaData title="My Applications" />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Applications</h1>
          <p className="mt-1 text-sm text-ink-muted">
            <span className="font-semibold text-ink">{myApplications.length}</span>{" "}
            {myApplications.length === 1 ? "application" : "applications"} submitted
          </p>
        </div>
      </div>

      {/* Status filter */}
      {myApplications.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {["All", ...STATUSES].map((s) => {
            const active = filter === s;
            const count = s === "All" ? myApplications.length : myApplications.filter((a) => a.status === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-100 text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {s} <span className={active ? "text-brand-100" : "text-ink-muted"}>({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : myApplications.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No applications yet"
          message="When you apply to jobs, they'll show up here so you can track their status."
          actionLabel="Browse Jobs"
          actionTo="/jobs"
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title={`No ${filter.toLowerCase()} applications`}
          message="Try a different status filter to see more of your applications."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((app) => {
            const job = app.job || {};
            const company = job.employer?.companyName;
            const removing = withdrawingId === app._id;
            return (
              <div
                key={app._id}
                className="card flex flex-col gap-4 p-5 transition hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {job._id ? (
                      <Link
                        to={`/jobs/${job._id}`}
                        className="truncate font-semibold text-ink hover:text-brand-700"
                      >
                        {job.title || "Job"}
                      </Link>
                    ) : (
                      <span className="truncate font-semibold text-ink">{job.title || "Job"}</span>
                    )}
                    <StatusBadge status={app.status} />
                  </div>

                  {company && <p className="mt-0.5 text-sm text-ink-muted">{company}</p>}

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
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
                    <span className="inline-flex items-center gap-1.5 text-ink-muted">
                      <FiClock /> Applied {timeAgo(app.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleWithdraw(app._id)}
                    disabled={removing}
                    className="btn-outline inline-flex items-center gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <FiTrash2 />
                    {removing ? "Withdrawing…" : "Withdraw"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
