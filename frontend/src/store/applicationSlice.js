import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/client";

export const applyForJob = createAsyncThunk("applications/apply", async ({ jobId, coverLetter }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/jobs/${jobId}/apply`, { coverLetter });
    return data.application;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchMyApplications = createAsyncThunk("applications/mine", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/applications/me");
    return data.applications;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const withdrawApplication = createAsyncThunk("applications/withdraw", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/applications/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchReceivedApplications = createAsyncThunk("applications/received", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/applications/received");
    return data.applications;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchJobApplicants = createAsyncThunk("applications/jobApplicants", async (jobId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/jobs/${jobId}/applicants`);
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/applications/${id}/status`, { status });
      return data.application;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const initialState = {
  myApplications: [],
  received: [],
  applicants: [],
  applicantsJob: null,
  loading: false,
  error: null,
  message: null,
};

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearApplicationError: (s) => { s.error = null; s.message = null; },
  },
  extraReducers: (b) => {
    b.addCase(applyForJob.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(applyForJob.fulfilled, (s) => { s.loading = false; s.message = "Application submitted"; })
      .addCase(applyForJob.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchMyApplications.pending, (s) => { s.loading = true; })
      .addCase(fetchMyApplications.fulfilled, (s, a) => { s.loading = false; s.myApplications = a.payload; })
      .addCase(fetchMyApplications.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(withdrawApplication.fulfilled, (s, a) => {
        s.myApplications = s.myApplications.filter((x) => x._id !== a.payload);
        s.message = "Application withdrawn";
      })

      .addCase(fetchReceivedApplications.pending, (s) => { s.loading = true; })
      .addCase(fetchReceivedApplications.fulfilled, (s, a) => { s.loading = false; s.received = a.payload; })
      .addCase(fetchReceivedApplications.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchJobApplicants.pending, (s) => { s.loading = true; })
      .addCase(fetchJobApplicants.fulfilled, (s, a) => {
        s.loading = false; s.applicants = a.payload.applications; s.applicantsJob = a.payload.job;
      })
      .addCase(fetchJobApplicants.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateApplicationStatus.fulfilled, (s, a) => {
        const upd = (list) => list.map((x) => (x._id === a.payload._id ? { ...x, status: a.payload.status } : x));
        s.applicants = upd(s.applicants);
        s.received = upd(s.received);
        s.message = "Status updated";
      });
  },
});

export const { clearApplicationError } = applicationSlice.actions;
export default applicationSlice.reducer;
