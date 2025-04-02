export const getAuthToken = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/auth/getAccessToken");
    if (!response.ok) throw new Error("Failed to fetch token");
    const data = await response.json();
    return data.token || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};
