import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import useAdminAuth from "../../hooks/useAdminAuth";
import LoadingMessage from "../ui/LoadingMessage";

export default function ProtectedAdminRoute() {
  const {
    loading,
    isAuthenticated,
  } = useAdminAuth();

  const location = useLocation();

  if (loading) {
    return (
      <LoadingMessage message="Checking admin session..." />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}