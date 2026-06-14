import axios from "axios";

/**
 * Central axios instance. `withCredentials` so the httpOnly auth cookie rides
 * along. Base URL is relative, proxied to the backend in dev (see package.json)
 * and same-origin in prod.
 */
const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// Normalise error messages so the UI always has a string to show.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
