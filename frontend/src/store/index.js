import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobReducer from "./jobSlice";
import applicationReducer from "./applicationSlice";
import eventReducer from "./eventSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    events: eventReducer,
  },
});

export default store;
