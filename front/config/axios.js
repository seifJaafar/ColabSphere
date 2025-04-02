import axios from "axios";

import { cookies } from "next/headers";
// Ensure API URL is correctly loaded from environment variables
const API_BASE_URL = process.env.API; // Use NEXT_PUBLIC_ for client-side env vars
const FRONTEND_URL = process.env.FRONTEND_URL;
if (!API_BASE_URL) {
  throw new Error("Missing API base URL in environment variables");
}

// Create Axios instance with baseURL and credentials enabled
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable sending cookies for refresh token
});
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};
api.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get("accessToken")?.value;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else {
      const accessToken = getCookie("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config; // 🔥 Always return config
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;
        if (!refreshToken) {
          console.warn("No refresh token found.");
          return Promise.reject(error);
        }
        const response = await fetch(`${FRONTEND_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) {
          console.error("Failed to refresh token:", response.status);
          cookieStore.set("accessToken", "", { maxAge: 0 }); // Delete token
          return Promise.reject(error);
        }
        const data = await response.json();
        const { accessToken, newRefreshToken } = data;
        cookieStore.set("refreshToken", newRefreshToken, {
          maxAge: 7 * 24 * 60 * 60, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        cookieStore.set("accessToken", accessToken, {
          maxAge: 15 * 60, // 15 minutes
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Error refreshing token:",
          refreshError.response?.data ||
            refreshError.message ||
            "error refreshing"
        );
        const cookieStore = await cookies();
        cookieStore.delete("accessToken");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
