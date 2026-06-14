import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiBookmark } from "react-icons/fi";
import toast from "react-hot-toast";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import JobCard from "../shared/JobCard";
import EmptyState from "../shared/EmptyState";
import { fetchSavedJobs, toggleSaveJob } from "../../store/jobSlice";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs, loading } = useSelector((s) => s.jobs);

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  const handleToggleSave = async (id) => {
    try {
      const { saved } = await dispatch(toggleSaveJob(id)).unwrap();
      // Re-fetch so an unsaved job drops out of the list.
      dispatch(fetchSavedJobs());
      toast.success(saved ? "Job saved" : "Removed from saved");
    } catch (err) {
      toast.error(err || "Could not update saved jobs");
    }
  };

  return (
    <div className="container-px py-8">
      <MetaData title="Saved Jobs" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Saved Jobs</h1>
        <p className="mt-1 text-sm text-ink-muted">
          <span className="font-semibold text-ink">{savedJobs.length}</span>{" "}
          {savedJobs.length === 1 ? "job" : "jobs"} saved for later
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={FiBookmark}
          title="No saved jobs"
          message="Save jobs to revisit them later."
          actionLabel="Browse Jobs"
          actionTo="/jobs"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              showSave
              saved
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
