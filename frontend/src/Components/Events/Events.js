import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCalendar, FiSearch } from "react-icons/fi";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import EventCard from "../shared/EventCard";
import EmptyState from "../shared/EmptyState";
import { fetchEvents } from "../../store/eventSlice";

const CATEGORIES = ["Hackathon", "Contest", "Workshop", "Webinar", "Fest", "Conference"];
const STATUSES = ["Upcoming", "Ongoing", "Completed"];

const Events = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { events, loading } = useSelector((s) => s.events);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  // Refetch whenever any filter changes (query string is the single source of truth).
  useEffect(() => {
    const qs = searchParams.toString();
    dispatch(fetchEvents(qs));
  }, [dispatch, searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <>
      <MetaData title="Hackathons & Events" />

      {/* Hero band */}
      <section className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="container-px py-10">
          <h1 className="text-2xl font-bold sm:text-3xl">Hackathons &amp; Events</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-100 sm:text-base">
            Compete in hackathons, level up at workshops &amp; webinars, and get noticed by recruiters.
            Build, learn, and get hired.
          </p>
        </div>
      </section>

      <div className="container-px py-8">
        {/* Filter row */}
        <div className="card mb-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              className="input pl-9"
              placeholder="Search hackathons, workshops, contests…"
              value={keyword}
              onChange={(e) => updateParam("keyword", e.target.value)}
            />
          </div>

          <select
            className="input sm:w-48"
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="input sm:w-44"
            value={status}
            onChange={(e) => updateParam("status", e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <Loader />
        ) : !events || events.length === 0 ? (
          <EmptyState
            icon={FiCalendar}
            title="No events found"
            message="Try adjusting your search or filters to discover more hackathons and events."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
