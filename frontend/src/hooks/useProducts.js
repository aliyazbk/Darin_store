import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        // Supports both paginated and non-paginated Laravel responses
        setProducts(response.data?.data ?? response.data ?? []);
      } catch (error) {
        console.error("Unable to load products:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
}

