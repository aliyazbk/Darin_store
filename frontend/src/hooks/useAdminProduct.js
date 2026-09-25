import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getAdminProduct } from "../services/adminProductService";

export default function useAdminProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNumber, setRefreshNumber] =
    useState(0);

  const refresh = useCallback(() => {
    setRefreshNumber((number) => number + 1);
  }, []);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setError("Product ID is missing.");
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const result = await getAdminProduct(
          productId
        );

        if (!cancelled) {
          setProduct(result);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Unable to load admin product:",
          error
        );

        setProduct(null);

        setError(
          error.response?.status === 404
            ? "Product not found."
            : error.response?.data?.message ??
                "Unable to load product."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId, refreshNumber]);

  return {
    product,
    loading,
    error,
    refresh,
  };
}