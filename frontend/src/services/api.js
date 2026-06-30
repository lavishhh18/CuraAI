import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Auth / Profile ────────────────────────────────────────────────

/**
 * Fetch user profile from DynamoDB by Clerk user ID.
 * GET /auth/profile/{userId}
 * @param {string} userId — Clerk user ID (e.g. "user_2abc...")
 * @returns {Promise<object>} user profile object
 */

export async function fetchUserProfile(userId) {
  const response = await api.get(`/auth/profile/${userId}`);
  return response.data;
}

/**
 * Save or update user profile after onboarding.
 * POST /auth/onboarding
 * @param {object} payload — onboarding form data
 * @returns {Promise<object>} saved user object
 */
export async function saveUserProfile(payload) {
  const response = await api.post("/auth/onboarding", payload);
  return response.data;
}
export const getUserProfile = fetchUserProfile;
export default api;
