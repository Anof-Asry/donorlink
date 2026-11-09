import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Send HttpOnly cookies with every request
});

// Attach Bearer token from localStorage (if present) to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("dl_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally — clear stale token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("dl_token");
      localStorage.removeItem("dl_user");
      // Don't force redirect here — let AuthContext/ProtectedRoute handle it
    }
    return Promise.reject(error);
  }
);

export default API;