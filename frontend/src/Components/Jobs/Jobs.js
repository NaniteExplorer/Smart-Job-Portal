import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import JobCard from "../shared/JobCard";
import EmptyState from "../shared/EmptyState";
import { fetchJobs, toggleSaveJob } from "../../store/jobSlice";

const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"];
const EXPERIENCE_LEVELS = ["Fresher", "Entry", "Mid", "Senior", "Lead"];

// Normalise user.savedJobs (ids or populated objects) into a Set of ids.
const savedIdSet = (savedJobs = []) =>
  new Set(savedJobs.map((j) => (typeof j === "string" ? j : j?._id)).filter(Boolean));

const Jobs = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { jobs, filteredJobsCount, resultPerPage, loading } = useSelector((s) => s.jobs);
  const { user } = useSelector((s) => s.auth);
  const isStudent = user?.role === "student";

  // ---- read current params ----
  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const jobType = searchParams.get("jobType") || "";
  const experienceLevel = searchParams.get("experienceLevel") || "";
  const salaryMin = searchParams.get("salaryMin[gte]") || "";
  const page = Number(searchParams.get("page")) || 1;

  // ---- local form state (mirrors params, edited before "Apply") ----
  const [form, setForm] = useState({ keyword, location, jobType, experienceLevel, salaryMin });
  const [showFilters, setShowFilters] = useState(false);

  // keep the form in sync if params change externally (e.g. clear / back nav)
  useEffect(() => {
    setForm({ keyword, location, jobType, experienceLevel, salaryMin });
  }, [keyword, location, jobType, experienceLevel, salaryMin]);

  // ---- locally tracked saved jobs (seeded from user, updated on toggle) ----
  const [savedSet, setSavedSet] = useState(() => savedIdSet(user?.savedJobs));
  useEffect(() => {
    setSavedSet(savedIdSet(user?.savedJobs));
  }, [user]);

  // ---- build query string from params and fetch on every param change ----
  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (keyword) qs.set("keyword", keyword);
    if (location) qs.set("location", location);
    if (jobType) qs.set("jobType", jobType);
    if (experienceLevel) qs.set("experienceLevel", experienceLevel);
    if (salaryMin) qs.set("salaryMin[gte]", salaryMin);
    if (page > 1) qs.set("page", String(page));
    return qs.toString();
  }, [keyword, location, jobType, experienceLevel, salaryMin, page]);

  useEffect(() => {
    dispatch(fetchJobs(queryString));
  }, [dispatch, queryString]);

  // ---- handlers ----
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const applyFilters = (e) => {
    e?.preventDefault();
    const qs = new URLSearchParams();
    if (form.keyword.trim()) qs.set("keyword", form.keyword.trim());
    if (form.location.trim()) qs.set("location", form.location.trim());
    if (form.jobType) qs.set("jobType", form.jobType);
    if (form.experienceLevel) qs.set("experienceLevel", form.experienceLevel);
    if (form.salaryMin) qs.set("salaryMin[gte]", form.salaryMin);
    // applying filters resets to page 1
    setSearchParams(qs);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setForm({ keyword: "", location: "", jobType: "", experienceLevel: "", salaryMin: "" });
    setSearchParams(new URLSearchParams());
    setShowFilters(false);
  };

  const goToPage = (p) => {
    const qs = new URLSearchParams(searchParams);
    if (p > 1) qs.set("page", String(p));
    else qs.delete("page");
    setSearchParams(qs);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleSave = async (id) => {
    try {
      const { saved } = await dispatch(toggleSaveJob(id)).unwrap();
      setSavedSet((prev) => {
        const next = new Set(prev);
        if (saved) next.add(id);
        else next.delete(id);
        return next;
      });
      toast.success(saved ? "Job saved" : "Removed from saved");
    } catch (err) {
      toast.error(err || "Could not update saved jobs");
    }
  };

  const totalPages = Math.ceil((filteredJobsCount || 0) / (resultPerPage || 1));

  // ---- filter sidebar markup (shared between mobile/desktop) ----
  const filtersForm = (
    <form onSubmit={applyFilters} className="space-y-4">
      <div>
        <label className="label" htmlFor="f-keyword">Keyword</label>
        <input
          id="f-keyword"
          className="input"
          placeholder="Title, skill, company"
          value={form.keyword}
          onChange={setField("keyword")}
        />
      </div>
      <div>
        <label className="label" htmlFor="f-location">Location</label>
        <input
          id="f-location"
          className="input"
          placeholder="City or remote"
          value={form.location}
          onChange={setField("location")}
        />
      </div>
      <div>
        <label className="label" htmlFor="f-jobType">Job type</label>
        <select id="f-jobType" className="input" value={form.jobType} onChange={setField("jobType")}>
          <option value="">Any type</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="f-exp">Experience level</label>
        <select id="f-exp" className="input" value={form.experienceLevel} onChange={setField("experienceLevel")}>
          <option value="">Any level</option>
          {EXPERIENCE_LEVELS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="f-salary">Minimum salary (₹/yr)</label>
        <input
          id="f-salary"
          type="number"
          min="0"
          step="10000"
          className="input"
          placeholder="e.g. 500000"
          value={form.salaryMin}
          onChange={setField("salaryMin")}
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1">Apply filters</button>
        <button type="button" onClick={clearFilters} className="btn-outline">Clear</button>
      </div>
    </form>
  );

  return (
    <div className="container-px py-8">
      <MetaData title="Browse jobs" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Find your next role</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Search openings across companies hiring on NexHire.
        </p>
      </div>

      {/* Mobile filter toggle */}
      <button
        type="button"
        onClick={() => setShowFilters((v) => !v)}
        className="btn-outline mb-4 inline-flex items-center gap-2 lg:hidden"
      >
        {showFilters ? <FiX /> : <FiSliders />}
        {showFilters ? "Hide filters" : "Filters"}
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar (collapses above grid on mobile) */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="card sticky top-24 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Filters
            </h2>
            {filtersForm}
          </div>
        </aside>

        {/* Main column */}
        <section>
          {/* Top bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">{filteredJobsCount || 0}</span> jobs found
              {keyword && (
                <>
                  {" "}for <span className="font-semibold text-brand-700">“{keyword}”</span>
                </>
              )}
            </p>
            {totalPages > 1 && (
              <span className="text-xs text-ink-muted">
                Page {page} of {totalPages}
              </span>
            )}
          </div>

          {loading ? (
            <Loader />
          ) : jobs?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    showSave={isStudent}
                    saved={savedSet.has(job._id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goToPage(p)}
                      aria-current={p === page ? "page" : undefined}
                      className={`min-w-[38px] rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                        p === page
                          ? "bg-brand-600 text-white shadow-sm"
                          : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          ) : (
            <EmptyState
              icon={FiSearch}
              title="No jobs match your search"
              message="Try adjusting or clearing your filters to see more openings."
              actionLabel="Clear filters"
              actionTo="/jobs"
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Jobs;
