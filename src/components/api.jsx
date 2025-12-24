// api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Adjust if needed for production

// Create a single axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for 401 handling (auto logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Export all API functions using the shared instance
export const register = async (data) => {
  const response = await api.post("/register", data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/login", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/profile", data);
  return response.data;
};

export const logout = async () => {
  await api.post("/logout");
};

export const deleteAccount = async () => {
  const response = await api.delete("/delete-account");
  return response.data;
};

export default api;
