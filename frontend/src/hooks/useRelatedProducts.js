import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

const RELATED_LIMIT = 4;

export default function useRelatedProducts(product) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categorySlug = product?.category?.slug;

    if (!categorySlug) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadRelated() {
      try {
        setLoading(true);

        const response = await getProducts(1, {
          category: categorySlug,
        });

        const items = response.data?.data ?? response.data ?? [];

        const related = items
          .filter((item) => item.id !== product.id)
          .slice(0, RELATED_LIMIT);

        if (!cancelled) {
          setProducts(related);
        }
      } catch (error) {
        console.error("Unable to load related products:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRelated();

    return () => {
      cancelled = true;
    };
  }, [product?.id, product?.category?.slug]);

  return { products, loading };
}
