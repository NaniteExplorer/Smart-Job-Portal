const styles = {
  Applied: "bg-slate-100 text-slate-700",
  Reviewed: "bg-blue-100 text-blue-700",
  Shortlisted: "bg-indigo-100 text-indigo-700",
  Interviewed: "bg-amber-100 text-amber-700",
  Offered: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
  Open: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-200 text-slate-600",
  Upcoming: "bg-blue-100 text-blue-700",
  Ongoing: "bg-emerald-100 text-emerald-700",
  Completed: "bg-slate-100 text-slate-600",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      styles[status] || "bg-slate-100 text-slate-700"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;
