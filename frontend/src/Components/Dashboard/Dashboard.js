import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiBriefcase,
  FiBookmark,
  FiFileText,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiPlusCircle,
  FiGrid,
  FiSearch,
  FiInbox,
} from "react-icons/fi";

import api from "../../api/client";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Avatar from "../shared/Avatar";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { displayName, formatDate } from "../../utils/format";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
      <Icon size={22} />
    </div>
    <div className="min-w-0">
      <div className="text-2xl font-bold leading-tight text-ink">{value ?? 0}</div>
      <div className="truncate text-sm text-ink-muted">{label}</div>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, to }) => (
  <Link
    to={to}
    className="card flex items-center gap-3 p-4 transition hover:border-brand-300 hover:shadow-md"
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
      <Icon size={18} />
    </span>
    <span className="font-medium text-ink">{label}</span>
  </Link>
);

const Dashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const role = user?.role;

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get("/dashboard");
        if (active) setDashboard(data.dashboard);
      } catch (err) {
        toast.error(err.message || "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loader />;

  const d = dashboard || {};

  const statsByRole = {
    student: [
      { icon: FiFileText, label: "Total Applications", value: d.totalApplications },
      { icon: FiBookmark, label: "Saved Jobs", value: d.savedJobs },
      { icon: FiCheckCircle, label: "Shortlisted", value: d.byStatus?.Shortlisted },
      { icon: FiBriefcase, label: "Offers", value: d.byStatus?.Offered },
    ],
    recruiter: [
      { icon: FiBriefcase, label: "Total Jobs", value: d.totalJobs },
      { icon: FiGrid, label: "Open Jobs", value: d.openJobs },
      { icon: FiUsers, label: "Total Applicants", value: d.totalApplicants },
      { icon: FiCalendar, label: "Events Hosted", value: d.eventsHosted },
    ],
    university: [
      { icon: FiUsers, label: "Total Students", value: d.totalStudents },
      { icon: FiCalendar, label: "Events Hosted", value: d.eventsHosted },
    ],
  };

  const actionsByRole = {
    student: [
      { icon: FiSearch, label: "Browse Jobs", to: "/jobs" },
      { icon: FiFileText, label: "My Applications", to: "/applications" },
      { icon: FiBookmark, label: "Saved Jobs", to: "/saved" },
    ],
    recruiter: [
      { icon: FiPlusCircle, label: "Post a Job", to: "/recruiter/jobs/new" },
      { icon: FiGrid, label: "Manage Jobs", to: "/recruiter/jobs" },
      { icon: FiCalendar, label: "Host Event", to: "/host/events/new" },
    ],
    university: [
      { icon: FiPlusCircle, label: "Host Event", to: "/host/events/new" },
      { icon: FiCalendar, label: "My Events", to: "/host/events" },
    ],
  };

  const stats = statsByRole[role] || [];
  const actions = actionsByRole[role] || [];

  return (
    <div className="container-px py-8">
      <MetaData title="Dashboard" />

      {/* Welcome header */}
      <div className="card mb-8 flex items-center gap-4 p-6">
        <Avatar url={user?.avatar?.url} name={displayName(user)} size="lg" />
        <div>
          <p className="text-sm text-ink-muted">Welcome back,</p>
          <h1 className="text-2xl font-bold text-ink">{displayName(user)}</h1>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} />
        ))}
      </div>

      {/* Quick actions */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-ink">Quick actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((a) => (
            <QuickAction key={a.label} icon={a.icon} label={a.label} to={a.to} />
          ))}
        </div>
      </section>

      {/* Recent applications (student only) */}
      {role === "student" && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-ink">Recent applications</h2>
          {d.recentApplications && d.recentApplications.length > 0 ? (
            <div className="card divide-y divide-slate-100">
              {d.recentApplications.map((app, i) => (
                <div
                  key={app._id || i}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">
                      {app.job?.title || "Job"}
                    </p>
                    <p className="truncate text-sm text-ink-muted">
                      {[app.job?.location, app.job?.jobType]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      Applied {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FiInbox}
              title="No applications yet"
              message="Start applying to jobs and they'll show up here."
              actionLabel="Browse Jobs"
              actionTo="/jobs"
            />
          )}
        </section>
      )}
    </div>
  );
};

export default Dashboard;
