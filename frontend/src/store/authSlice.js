import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/client";

export const login = createAsyncThunk("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", creds);
    return data.user;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data.user;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const loadUser = createAsyncThunk("auth/loadUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/me");
    return data.user;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put("/me/update", payload);
    return data.user;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const updatePassword = createAsyncThunk("auth/updatePassword", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put("/me/password", payload);
    return data.message;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await api.get("/auth/logout");
});

export const deleteAccount = createAsyncThunk("auth/deleteAccount", async (_, { rejectWithValue }) => {
  try {
    await api.delete("/me");
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false, // becomes true after first loadUser attempt
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const onAuth = (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    };
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, onAuth)
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, onAuth)
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(loadUser.pending, (s) => { s.loading = true; })
      .addCase(loadUser.fulfilled, (s, a) => {
        s.loading = false; s.user = a.payload; s.isAuthenticated = true; s.initialized = true;
      })
      .addCase(loadUser.rejected, (s) => {
        s.loading = false; s.user = null; s.isAuthenticated = false; s.initialized = true;
      })

      .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload; })

      .addCase(logout.fulfilled, (s) => { s.user = null; s.isAuthenticated = false; })
      .addCase(deleteAccount.fulfilled, (s) => { s.user = null; s.isAuthenticated = false; });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
