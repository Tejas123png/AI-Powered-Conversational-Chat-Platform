// In dev, Vite proxies /api → http://localhost:8080, so we use relative path.
// Set VITE_API_BASE_URL for production deployments.
const rawBase = import.meta.env.VITE_API_BASE_URL || "";
const BASE = rawBase.replace(/\/+$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

// --- Threads ---

/** Create a brand-new thread. Returns the full Thread document. */
export const createThread = () => request("/api/thread", { method: "POST" });

/** Fetch all threads, sorted newest-first. Returns Thread[]. */
export const getThreads = () => request("/api/thread");

/** Fetch one thread by its MongoDB _id. Returns Thread document. */
export const getThread = (id) => request(`/api/thread/${id}`);

/** Delete a thread by MongoDB _id. */
export const deleteThread = (id) =>
  request(`/api/thread/${id}`, { method: "DELETE" });

/** Update thread title. */
export const updateThreadTitle = (id, title) =>
  request(`/api/thread/${id}/title`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });

// --- Chat ---

/**
 * Send a message.
 * @param {string} thread_id  - The thread's thread_id field (UUID string)
 * @param {string} message    - User message text
 * Returns { thread_id, _id, assistantMessage: { role, content, timeStamp }, thread }
 */
export const sendMessage = (thread_id, message) =>
  request("/api/chat", {
    method: "POST",
    body: JSON.stringify({ thread_id, message }),
  });
