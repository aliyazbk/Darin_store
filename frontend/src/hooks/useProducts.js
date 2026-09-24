import { useEffect, useState } from "react";
import { getProductBySlug } from "../services/productService";

function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let requestIsActive = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const result = await getProductBySlug(slug);

        if (requestIsActive) {
          setProduct(result);
        }
      } catch (error) {
        console.error(error);

        if (requestIsActive) {
          if (error.response?.status === 404) {
            setError("Product not found.");
          } else {
            setError("Unable to load the product.");
          }
        }
      } finally {
        if (requestIsActive) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      requestIsActive = false;
    };
  }, [slug]);

  return { product, loading, error };
}

export default useProduct;