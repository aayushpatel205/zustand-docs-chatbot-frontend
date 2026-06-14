// service/authService.js
import apiClient from "./apiClient.js";
import { getRefreshToken } from "../Utils/tokenStorage.js";

// ─── Register ────────────────────────────────────────────────────────────────
export const registerUser = async (name, email, password) => {
  const response = await apiClient.post('/auth/register', {
    name,
    email,
    password,
  });
  return response.data.data;
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  return response.data.data; // ✅ unwrap to get { accessToken, user }
};

// ─── Logout ──────────────────────────────────────────────────────────────────
// No body needed — backend reads refreshToken from httpOnly cookie directly
export const logoutUser = async () => {
  const refreshToken = await getRefreshToken(); // ← read from SecureStore
  const response = await apiClient.post('/auth/logout', { refreshToken }); // ← send in body
  return response.data;
};

// ─── Refresh ─────────────────────────────────────────────────────────────────
// No body needed — backend reads refreshToken from httpOnly cookie directly


export const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken(); // ← read from SecureStore
  const response = await apiClient.post('/auth/refresh', { refreshToken }); // ← send in body
  return response.data.data; 
};

// ─── Get Current User ────────────────────────────────────────────────────────
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data.data; 
};