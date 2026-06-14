import { Link } from "react-router-dom";
import { FiCalendar, FiAward, FiUsers, FiMapPin } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import { formatDate, formatSalary } from "../../utils/format";

const categoryColor = {
  Hackathon: "from-brand-600 to-brand-800",
  Contest: "from-indigo-600 to-violet-700",
  Workshop: "from-emerald-600 to-teal-700",
  Webinar: "from-amber-500 to-orange-600",
  Fest: "from-pink-600 to-rose-700",
  Conference: "from-slate-600 to-slate-800",
};

const EventCard = ({ event }) => (
  <Link
    to={`/events/${event._id}`}
    className="card group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
  >
    <div
      className={`relative h-28 bg-gradient-to-br ${
        categoryColor[event.category] || "from-brand-600 to-brand-800"
      }`}
    >
      {event.banner?.url && (
        <img src={event.banner.url} alt="" className="h-full w-full object-cover opacity-80" />
      )}
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-ink">
        {event.category}
      </span>
      <span className="absolute right-3 top-3">
        <StatusBadge status={event.status} />
      </span>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <h3 className="font-semibold text-ink group-hover:text-brand-700">{event.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{event.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <FiCalendar className="text-brand-500" /> {formatDate(event.startDate)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiMapPin className="text-brand-500" /> {event.mode}
        </span>
        {event.prizePool > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <FiAward className="text-brand-500" /> {formatSalary(event.prizePool)}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <FiUsers className="text-brand-500" /> Team of {event.teamSize}
        </span>
      </div>
    </div>
  </Link>
);

export default EventCard;
