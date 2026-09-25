import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from "../services/adminAuthService";

export const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(
      "darin-admin-token"
    );

    if (!token) {
      setLoading(false);
      return;
    }

    async function loadAdmin() {
      try {
        const currentAdmin = await getCurrentAdmin();
        setAdmin(currentAdmin);
      } catch (error) {
        console.error(
          "Unable to restore admin session:",
          error
        );

        localStorage.removeItem("darin-admin-token");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await loginAdmin(credentials);

    localStorage.setItem(
      "darin-admin-token",
      result.token
    );

    setAdmin(result.admin);

    return result.admin;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      localStorage.removeItem("darin-admin-token");
      setAdmin(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      admin,
      loading,
      isAuthenticated: Boolean(admin),
      login,
      logout,
    }),
    [admin, loading, login, logout]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}