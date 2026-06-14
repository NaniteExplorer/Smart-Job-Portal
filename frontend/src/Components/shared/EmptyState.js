import { FiInbox } from "react-icons/fi";
import { Link } from "react-router-dom";

const EmptyState = ({ icon: Icon = FiInbox, title, message, actionLabel, actionTo }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
      <Icon size={26} />
    </div>
    <h3 className="text-lg font-semibold text-ink">{title}</h3>
    {message && <p className="mt-1 max-w-sm text-sm text-ink-muted">{message}</p>}
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn-primary mt-5">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
