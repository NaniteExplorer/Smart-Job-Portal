import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/client";

export const fetchEvents = createAsyncThunk("events/fetchAll", async (query = "", { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/events${query ? `?${query}` : ""}`);
    return data.events;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchEventDetails = createAsyncThunk("events/details", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/events/${id}`);
    return data.event;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const createEvent = createAsyncThunk("events/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/events", payload);
    return data.event;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const fetchMyEvents = createAsyncThunk("events/mine", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/events/hosted");
    return data.events;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const toggleRegisterEvent = createAsyncThunk("events/register", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/events/${id}/register`);
    return { id, registered: data.registered };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const deleteEvent = createAsyncThunk("events/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/events/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const initialState = {
  events: [],
  event: null,
  myEvents: [],
  loading: false,
  error: null,
  message: null,
  actionLoading: false,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventError: (s) => { s.error = null; s.message = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchEvents.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchEvents.fulfilled, (s, a) => { s.loading = false; s.events = a.payload; })
      .addCase(fetchEvents.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchEventDetails.pending, (s) => { s.loading = true; s.event = null; })
      .addCase(fetchEventDetails.fulfilled, (s, a) => { s.loading = false; s.event = a.payload; })
      .addCase(fetchEventDetails.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createEvent.pending, (s) => { s.actionLoading = true; })
      .addCase(createEvent.fulfilled, (s, a) => { s.actionLoading = false; s.message = "Event created"; s.myEvents.unshift(a.payload); })
      .addCase(createEvent.rejected, (s, a) => { s.actionLoading = false; s.error = a.payload; })

      .addCase(fetchMyEvents.fulfilled, (s, a) => { s.myEvents = a.payload; })
      .addCase(deleteEvent.fulfilled, (s, a) => { s.myEvents = s.myEvents.filter((e) => e._id !== a.payload); s.message = "Event deleted"; })

      .addCase(toggleRegisterEvent.fulfilled, (s, a) => {
        s.message = a.payload.registered ? "Registered!" : "Unregistered";
      });
  },
});

export const { clearEventError } = eventSlice.actions;
export default eventSlice.reducer;
