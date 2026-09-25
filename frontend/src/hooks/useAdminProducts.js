import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getAdminProducts } from "../services/adminProductService";

export default function useAdminProducts({
  page = 1,
  search = "",
} = {}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNumber, setRefreshNumber] = useState(0);

  const refresh = useCallback(() => {
    setRefreshNumber((number) => number + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const result = await getAdminProducts({
          page,
          search: search || undefined,
        });

        if (cancelled) {
          return;
        }

        setProducts(result.data ?? []);

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
          "Unable to load admin products:",
          error
        );

        setError(
          error.response?.data?.message ??
            "Unable to load products."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [page, search, refreshNumber]);

  return {
    products,
    pagination,
    loading,
    error,
    refresh,
  };
}