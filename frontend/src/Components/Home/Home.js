import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiMapPin,
  FiArrowRight,
  FiUsers,
  FiBriefcase,
  FiAward,
  FiBookOpen,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import JobCard from "../shared/JobCard";
import EventCard from "../shared/EventCard";
import { fetchJobs } from "../../store/jobSlice";
import { fetchEvents } from "../../store/eventSlice";

const audiences = [
  {
    icon: FiBookOpen,
    title: "Students",
    desc: "Discover jobs & internships, build your profile, and compete in hackathons to land the role you deserve.",
  },
  {
    icon: FiBriefcase,
    title: "Colleges",
    desc: "Connect your students with verified recruiters, track placements, and host campus events in one place.",
  },
  {
    icon: FiUsers,
    title: "Recruiters",
    desc: "Post jobs, run hackathons, and source pre-vetted talent straight from top universities — faster.",
  },
];

const stats = [
  { value: "10k+", label: "Students" },
  { value: "500+", label: "Recruiters" },
  { value: "1k+", label: "Jobs posted" },
  { value: "200+", label: "Hackathons" },
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const { jobs, loading: jobsLoading } = useSelector((s) => s.jobs);
  const { events, loading: eventsLoading } = useSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchJobs(""));
    dispatch(fetchEvents(""));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    const qs = params.toString();
    navigate(qs ? `/jobs?${qs}` : "/jobs");
  };

  const featuredJobs = (jobs || []).slice(0, 6);
  const upcomingEvents = (events || []).slice(0, 3);

  return (
    <>
      <MetaData title="Home" />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white">
        {/* floating accent shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute -left-16 top-12 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div
            className="animate-float absolute right-0 top-40 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="animate-float absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl"
            style={{ animationDelay: "3s" }}
          />
        </div>

        <div className="container-px relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-100 ring-1 ring-inset ring-white/20">
              <FiZap className="text-brand-200" /> LinkedIn × Naukri × Unstop, reimagined
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Where students, colleges &amp; recruiters{" "}
              <span className="bg-gradient-to-r from-brand-200 to-white bg-clip-text text-transparent">
                truly connect
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-100/90">
              NexHire bridges the gap between talent and opportunity — find jobs,
              host hackathons, and grow your career, all on one professional platform.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white/95 p-3 shadow-card-hover backdrop-blur sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 rounded-lg px-3">
                <FiSearch className="shrink-0 text-brand-500" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, skill or company"
                  className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="hidden w-px bg-slate-200 sm:block" />
              <div className="flex flex-1 items-center gap-2 rounded-lg px-3">
                <FiMapPin className="shrink-0 text-brand-500" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                <FiSearch /> Search jobs
              </button>
            </form>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/jobs"
                className="btn inline-flex bg-white text-brand-700 shadow-sm hover:bg-brand-50"
              >
                <FiBriefcase /> Find Jobs
              </Link>
              <Link
                to="/signup"
                className="btn inline-flex border border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                <FiAward /> Host a Hackathon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THREE AUDIENCES */}
      <section className="container-px py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Built for everyone
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            One platform, three journeys
          </h2>
          <p className="mt-3 text-ink-muted">
            Whether you are starting out, placing students, or hiring the best —
            NexHire has you covered.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {audiences.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card group flex flex-col p-7 transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="text-xl" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                Hand-picked roles
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Featured jobs
              </h2>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
            >
              View all jobs <FiArrowRight />
            </Link>
          </div>

          {jobsLoading ? (
            <Loader full={false} />
          ) : featuredJobs.length === 0 ? (
            <p className="mt-10 text-center text-ink-muted">
              No jobs to show yet — check back soon.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map((j) => (
                <JobCard key={j._id} job={j} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="container-px py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Compete &amp; learn
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Upcoming hackathons &amp; events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
          >
            Explore events <FiArrowRight />
          </Link>
        </div>

        {eventsLoading ? (
          <Loader full={false} />
        ) : upcomingEvents.length === 0 ? (
          <p className="mt-10 text-center text-ink-muted">
            No events scheduled right now — stay tuned.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        )}
      </section>

      {/* STATS STRIP */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white">
        <div className="container-px py-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-extrabold tracking-tight">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-brand-100/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BAND */}
      <section className="container-px py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-8 py-16 text-center text-white shadow-card-hover">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-float absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div
              className="animate-float absolute -bottom-12 left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
              style={{ animationDelay: "2s" }}
            />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <FiTrendingUp className="mx-auto text-3xl text-brand-100" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to take the next step?
            </h2>
            <p className="mt-3 text-brand-100/90">
              Join thousands of students, colleges, and recruiters building their
              future on NexHire. It is free to get started.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="btn inline-flex bg-white text-brand-700 shadow-sm hover:bg-brand-50"
              >
                Create your account <FiArrowRight />
              </Link>
              <Link
                to="/jobs"
                className="btn inline-flex border border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                Browse jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
