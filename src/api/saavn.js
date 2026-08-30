import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

/**
 * Search songs on JioSaavn
 * @param {string} query - e.g. "telugu songs"
 * @returns {Promise<Array>} list of songs
 */
export async function searchSongs(query) {
  try {
    const res = await api.get(import.meta.env.VITE_API_ENDPOINT, {
      params: { query }, // axios handles encodeURIComponent for us ✅
    });
    return res.data ?? [];
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    }
    if (err.response) {
      throw new Error(`API error: ${err.response.status}`);
    }
    throw new Error("Network error. Check your connection.");
  }
}
