import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api, { unwrap } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("lfc_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem("lfc_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("lfc_user");
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    api
      .get("/auth/me")
      .then((response) => {
        if (active) setUser(unwrap(response).user);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const expire = () => {
      setUser(null);
      toast.error("Your session expired. Please sign in again.");
    };
    window.addEventListener("lfc:session-expired", expire);
    return () => window.removeEventListener("lfc:session-expired", expire);
  }, []);

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", payload);
      const data = unwrap(response);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", payload);
      const data = unwrap(response);
      setUser(data.user);
      toast.success("Your secure client workspace is ready");
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Local session cleanup still matters if the server session already expired.
    }
    setUser(null);
    toast.success("Signed out securely");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      isAuthenticated: Boolean(user),
      hasRole: (...roles) => roles.includes(user?.role?.slug || user?.role),
      login,
      register,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
