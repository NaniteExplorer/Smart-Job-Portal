import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiAward,
  FiUsers,
  FiUserCheck,
  FiGlobe,
  FiExternalLink,
} from "react-icons/fi";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Avatar from "../shared/Avatar";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";
import { formatDate, formatSalary } from "../../utils/format";
import { fetchEventDetails, toggleRegisterEvent } from "../../store/eventSlice";

const categoryGradient = {
  Hackathon: "from-brand-600 to-brand-800",
  Contest: "from-indigo-600 to-violet-700",
  Workshop: "from-emerald-600 to-teal-700",
  Webinar: "from-amber-500 to-orange-600",
  Fest: "from-pink-600 to-rose-700",
  Conference: "from-slate-600 to-slate-800",
};

const Fact = ({ icon: Icon, label, value }) => (
  <div className="card flex items-start gap-3 p-4">
    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
      <Icon size={18} />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-0.5 truncate font-semibold text-ink">{value}</p>
    </div>
  </div>
);

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { event, loading, actionLoading } = useSelector((s) => s.events);
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  // Optimistic local registration flag, synced from the loaded event.
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    dispatch(fetchEventDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (event && user) {
      setRegistered((event.participants || []).some((p) => (p?._id || p) === user._id));
    } else {
      setRegistered(false);
    }
  }, [event, user]);

  if (loading) return <Loader />;

  if (!event) {
    return (
      <div className="container-px py-10">
        <MetaData title="Event not found" />
        <EmptyState
          icon={FiCalendar}
          title="Event not found"
          message="This event may have been removed or the link is incorrect."
          actionLabel="Browse events"
          actionTo="/events"
        />
      </div>
    );
  }

  const host = event.host || {};
  const hostName = host.companyName || host.name || "Host";
  const isStudent = isAuthenticated && user?.role === "student";

  const handleRegister = async () => {
    try {
      const res = await dispatch(toggleRegisterEvent(event._id)).unwrap();
      setRegistered(res.registered);
      toast.success(res.registered ? "Registered successfully!" : "Registration cancelled");
    } catch (err) {
      toast.error(err || "Could not update registration");
    }
  };

  const gradient = categoryGradient[event.category] || "from-brand-600 to-brand-800";

  return (
    <>
      <MetaData title={event.title} />

      {/* Banner header */}
      <section className={`relative bg-gradient-to-br ${gradient} text-white`}>
        {event.banner?.url && (
          <img
            src={event.banner.url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="container-px relative py-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
              {event.category}
            </span>
            <StatusBadge status={event.status} />
          </div>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{event.title}</h1>
          <div className="mt-4 flex items-center gap-3">
            <Avatar url={host.avatar?.url} name={hostName} size="md" />
            <div>
              <p className="text-xs text-brand-100">Hosted by</p>
              <p className="font-semibold">{hostName}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-px py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="lg:col-span-2">
            {/* Key facts */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Fact
                icon={FiCalendar}
                label="When"
                value={`${formatDate(event.startDate)} – ${formatDate(event.endDate)}`}
              />
              <Fact icon={FiMapPin} label="Mode" value={event.mode} />
              {event.location && <Fact icon={FiGlobe} label="Location" value={event.location} />}
              {event.prizePool > 0 && (
                <Fact icon={FiAward} label="Prize pool" value={formatSalary(event.prizePool)} />
              )}
              <Fact icon={FiUsers} label="Team size" value={`Up to ${event.teamSize}`} />
              <Fact
                icon={FiClock}
                label="Register by"
                value={formatDate(event.registrationDeadline)}
              />
              <Fact
                icon={FiUserCheck}
                label="Participants"
                value={`${(event.participants || []).length} registered`}
              />
            </div>

            {/* Description */}
            <div className="card mt-8 p-6">
              <h2 className="text-lg font-semibold text-ink">About this event</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {event.description}
              </p>

              {event.tags?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {event.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Action card */}
            <div className="card p-6">
              {isStudent ? (
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className={`w-full ${registered ? "btn-outline" : "btn-primary"} disabled:opacity-60`}
                >
                  {registered ? "Registered ✓" : "Register"}
                </button>
              ) : isAuthenticated ? (
                <p className="text-center text-sm text-ink-muted">
                  Registration is open to students.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="btn-primary w-full"
                >
                  Sign in to register
                </button>
              )}
              <p className="mt-3 text-center text-xs text-ink-muted">
                Registration closes {formatDate(event.registrationDeadline)}
              </p>
            </div>

            {/* Host info card */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                About the host
              </h3>
              <div className="mt-4 flex items-center gap-3">
                <Avatar url={host.avatar?.url} name={hostName} size="md" />
                <p className="font-semibold text-ink">{hostName}</p>
              </div>
              {host.website && (
                <a
                  href={host.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  <FiExternalLink /> Visit website
                </a>
              )}
            </div>

            <Link to="/events" className="btn-ghost w-full justify-center">
              ← Back to all events
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
