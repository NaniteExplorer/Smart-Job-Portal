import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/client";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (query = "", { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/jobs${query ? `?${query}` : ""}`);
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchJobDetails = createAsyncThunk("jobs/fetchJobDetails", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/jobs/${id}`);
    return data.job;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const createJob = createAsyncThunk("jobs/createJob", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/jobs", payload);
    return data.job;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const updateJob = createAsyncThunk("jobs/updateJob", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/jobs/${id}`, payload);
    return data.job;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/jobs/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchMyJobs = createAsyncThunk("jobs/fetchMyJobs", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/recruiter/jobs");
    return data.jobs;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const toggleSaveJob = createAsyncThunk("jobs/toggleSaveJob", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/jobs/${id}/save`);
    return { id, saved: data.saved };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchSavedJobs = createAsyncThunk("jobs/fetchSavedJobs", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/jobs/saved");
    return data.jobs;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const initialState = {
  jobs: [],
  job: null,
  myJobs: [],
  savedJobs: [],
  jobsCount: 0,
  filteredJobsCount: 0,
  resultPerPage: 12,
  loading: false,
  error: null,
  actionLoading: false,
  message: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobError: (s) => { s.error = null; s.message = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchJobs.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchJobs.fulfilled, (s, a) => {
        s.loading = false;
        s.jobs = a.payload.jobs;
        s.jobsCount = a.payload.jobsCount;
        s.filteredJobsCount = a.payload.filteredJobsCount;
        s.resultPerPage = a.payload.resultPerPage;
      })
      .addCase(fetchJobs.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchJobDetails.pending, (s) => { s.loading = true; s.job = null; })
      .addCase(fetchJobDetails.fulfilled, (s, a) => { s.loading = false; s.job = a.payload; })
      .addCase(fetchJobDetails.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createJob.pending, (s) => { s.actionLoading = true; s.error = null; })
      .addCase(createJob.fulfilled, (s, a) => { s.actionLoading = false; s.message = "Job posted"; s.myJobs.unshift(a.payload); })
      .addCase(createJob.rejected, (s, a) => { s.actionLoading = false; s.error = a.payload; })

      .addCase(updateJob.fulfilled, (s, a) => {
        s.myJobs = s.myJobs.map((j) => (j._id === a.payload._id ? a.payload : j));
        s.message = "Job updated";
      })
      .addCase(deleteJob.fulfilled, (s, a) => {
        s.myJobs = s.myJobs.filter((j) => j._id !== a.payload);
        s.message = "Job deleted";
      })

      .addCase(fetchMyJobs.pending, (s) => { s.loading = true; })
      .addCase(fetchMyJobs.fulfilled, (s, a) => { s.loading = false; s.myJobs = a.payload; })
      .addCase(fetchMyJobs.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchSavedJobs.fulfilled, (s, a) => { s.savedJobs = a.payload; });
  },
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
