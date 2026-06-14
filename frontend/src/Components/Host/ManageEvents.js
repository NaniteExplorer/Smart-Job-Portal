import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiCalendar, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import EmptyState from "../shared/EmptyState";
import EventCard from "../shared/EventCard";
import StatusBadge from "../shared/StatusBadge";
import { fetchMyEvents, deleteEvent } from "../../store/eventSlice";

const ManageEvents = () => {
  const dispatch = useDispatch();
  const { myEvents, loading } = useSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This action cannot be undone.")) return;
    try {
      await dispatch(deleteEvent(id)).unwrap();
      toast.success("Event deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="container-px py-10">
      <MetaData title="My Events" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">My Events</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage the hackathons, workshops and contests you host.
          </p>
        </div>
        <Link to="/host/events/new" className="btn-primary inline-flex items-center gap-2">
          <FiPlus /> Create Event
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : !myEvents || myEvents.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FiCalendar}
            title="No events yet"
            message="Host a hackathon, workshop or contest."
            actionLabel="Create Event"
            actionTo="/host/events/new"
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myEvents.map((e) => (
            <div key={e._id} className="flex flex-col gap-3">
              <EventCard event={e} />
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
                <div className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <FiUsers className="text-brand-500" />
                    {e.participants?.length || 0} joined
                  </span>
                  <StatusBadge status={e.status} />
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(e._id)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
