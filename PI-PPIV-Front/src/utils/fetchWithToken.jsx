//utils/fetchWithToken.jsx
import config from "../config";

export async function fetchWithToken(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${config.baseUrl}${endpoint}`, { ...options, headers });

    if (!res.ok) {
      let errorMessage = `Error ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.error("Error parsing error response:", e);
      }
      throw new Error(errorMessage);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      return data;
    }
    return await res.text();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error en la petición al servidor");
  }
}
