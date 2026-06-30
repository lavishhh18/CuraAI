import api from "../api";

export const saveUserProfile = async (payload) => {
  const response = await api.post("/auth/onboarding", payload);
  return response.data;
};

export const fetchUserProfile = async (clerkId) => {
  const response = await api.get(`/auth/profile/${clerkId}`);
  return response.data;
};