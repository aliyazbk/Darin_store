import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getAdminOrder } from "../services/adminOrderService";

export default function useAdminOrder(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNumber, setRefreshNumber] =
    useState(0);

  const refresh = useCallback(() => {
    setRefreshNumber((number) => number + 1);
  }, []);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Order ID is missing.");
      return;
    }

    let cancelled = false;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const result = await getAdminOrder(orderId);

        if (!cancelled) {
          setOrder(result);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Unable to load admin order:",
          error
        );

        setOrder(null);

        setError(
          error.response?.status === 404
            ? "Order not found."
            : error.response?.data?.message ??
                "Unable to load order."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId, refreshNumber]);

  return {
    order,
    loading,
    error,
    refresh,
  };
}