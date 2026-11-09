import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Authenticated user object
  const [loading, setLoading] = useState(true); // True while verifying token on mount

  // ── Verify token on initial load ─────────────────────────────────────────
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("dl_token");
        if (!token) {
          setLoading(false);
          return;
        }
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch {
        // Token invalid or expired — clean up
        localStorage.removeItem("dl_token");
        localStorage.removeItem("dl_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  // ── Signup ────────────────────────────────────────────────────────────────
  const signup = useCallback(async (formData) => {
    const { data } = await API.post("/auth/signup", formData);
    localStorage.setItem("dl_token", data.token);
    localStorage.setItem("dl_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const { data } = await API.post("/auth/login", credentials);
    localStorage.setItem("dl_token", data.token);
    localStorage.setItem("dl_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // Best effort — clear client state regardless
    }
    localStorage.removeItem("dl_token");
    localStorage.removeItem("dl_user");
    setUser(null);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "admin";
  const isDonor = user?.role === "donor";
  const isRecipient = user?.role === "recipient";

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, isAdmin, isDonor, isRecipient, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
