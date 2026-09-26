import {
  useEffect,
  useState,
} from "react";

import { getAdminDashboard } from "../services/AdminDashboardService";

export default function useAdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const result = await getAdminDashboard();

        setStatistics(result.statistics);
        setRecentOrders(result.recent_orders);
      } catch (error) {
        console.error(
          "Unable to load dashboard:",
          error
        );

        setError(
          error.response?.data?.message ??
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return {
    statistics,
    recentOrders,
    loading,
    error,
  };
}