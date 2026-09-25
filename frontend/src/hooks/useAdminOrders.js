import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getAdminOrders } from "../services/adminOrderService";

export default function useAdminOrders({
  page = 1,
  search = "",
  status = "",
} = {}) {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNumber, setRefreshNumber] =
    useState(0);

  const refresh = useCallback(() => {
    setRefreshNumber((number) => number + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const result = await getAdminOrders({
          page,
          search: search || undefined,
          status: status || undefined,
        });

        if (cancelled) {
          return;
        }

        setOrders(result.data ?? []);

        setPagination({
          currentPage: result.current_page,
          lastPage: result.last_page,
          total: result.total,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Unable to load admin orders:",
          error
        );

        setError(
          error.response?.data?.message ??
            "Unable to load orders."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    search,
    status,
    refreshNumber,
  ]);

  return {
    orders,
    pagination,
    loading,
    error,
    refresh,
  };
}