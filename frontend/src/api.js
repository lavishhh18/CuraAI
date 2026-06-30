import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchUserProfile(userId) {
  const response = await api.get(`/auth/profile/${userId}`);
  return response.data;
}

export async function saveUserProfile(payload) {
  const response = await api.post("/auth/onboarding", payload);
  return response.data;
}

export const getUserProfile = fetchUserProfile;

export default api;
