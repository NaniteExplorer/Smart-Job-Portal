import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import { createEvent } from "../../store/eventSlice";

const CATEGORIES = ["Hackathon", "Contest", "Workshop", "Webinar", "Fest", "Conference"];
const MODES = ["Online", "Offline", "Hybrid"];

const EventForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionLoading } = useSelector((s) => s.events);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Hackathon",
    mode: "Online",
    location: "",
    tags: "",
    prizePool: "",
    teamSize: 1,
    registrationDeadline: "",
    startDate: "",
    endDate: "",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!form.startDate) return toast.error("Start date is required");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      mode: form.mode,
      location: form.location.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      prizePool: Number(form.prizePool) || 0,
      teamSize: Number(form.teamSize) || 1,
      registrationDeadline: form.registrationDeadline || undefined,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
    };

    try {
      await dispatch(createEvent(payload)).unwrap();
      toast.success("Event created");
      navigate("/host/events");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="container-px py-10">
      <MetaData title="Create Event" />

      <div className="mx-auto max-w-3xl">
        <div className="card overflow-hidden p-0">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-7 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <FiCalendar size={22} />
              </span>
              <div>
                <h1 className="text-xl font-bold">Create an Event</h1>
                <p className="text-sm text-white/80">
                  Host a hackathon, contest, workshop or webinar.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label className="label" htmlFor="title">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="input"
                placeholder="e.g. NexHire Summer Hackathon 2026"
                value={form.title}
                onChange={onChange}
              />
            </div>

            <div>
              <label className="label" htmlFor="description">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                className="input"
                placeholder="Describe the event, agenda, eligibility and what participants can expect."
                value={form.description}
                onChange={onChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="input"
                  value={form.category}
                  onChange={onChange}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="mode">
                  Mode
                </label>
                <select
                  id="mode"
                  name="mode"
                  className="input"
                  value={form.mode}
                  onChange={onChange}
                >
                  {MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="input"
                placeholder="e.g. Bengaluru, India or a meeting link"
                value={form.location}
                onChange={onChange}
              />
            </div>

            <div>
              <label className="label" htmlFor="tags">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="input"
                placeholder="Comma-separated, e.g. AI, Web3, Open Source"
                value={form.tags}
                onChange={onChange}
              />
              <p className="mt-1 text-xs text-ink-muted">Separate tags with commas.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="prizePool">
                  Prize Pool
                </label>
                <input
                  id="prizePool"
                  name="prizePool"
                  type="number"
                  min="0"
                  className="input"
                  placeholder="0"
                  value={form.prizePool}
                  onChange={onChange}
                />
              </div>
              <div>
                <label className="label" htmlFor="teamSize">
                  Team Size
                </label>
                <input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  min="1"
                  className="input"
                  value={form.teamSize}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="registrationDeadline">
                  Registration Deadline
                </label>
                <input
                  id="registrationDeadline"
                  name="registrationDeadline"
                  type="date"
                  className="input"
                  value={form.registrationDeadline}
                  onChange={onChange}
                />
              </div>
              <div>
                <label className="label" htmlFor="startDate">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="input"
                  value={form.startDate}
                  onChange={onChange}
                />
              </div>
              <div>
                <label className="label" htmlFor="endDate">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="input"
                  value={form.endDate}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => navigate("/host/events")}
                className="btn-outline"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={actionLoading}>
                {actionLoading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
