const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "") + "/api/auth";

export const authService = {
  async register(name, email, password) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to register");
    }
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to login");
    }
    return res.json();
  },

  async logout() {
    const res = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to logout");
    }
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${BASE_URL}/me`, {
      credentials: "include",
    });
    if (!res.ok) {
      // 401 is expected if not logged in
      if (res.status === 401) return null;
      throw new Error("Failed to get user");
    }
    return res.json();
  },
};
