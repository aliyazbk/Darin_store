import { useEffect, useState } from "react";
import { getProductBySlug } from "../services/productService";

export default function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Product slug is missing.");
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const productData = await getProductBySlug(slug);

        setProduct(productData);
      } catch (error) {
        console.error("Unable to load product:", error);

        setProduct(null);
        setError(
          error.response?.data?.message ??
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  return { product, loading, error };
}