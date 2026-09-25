import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getProducts } from "../services/productService";
import ProductGrid from "../components/Products/ProductGrid";
import LoadingMessage from "../components/ui/LoadingMessage";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyMessage from "../components/ui/EmptyMessage";
import "../styles/pages/ProductPage.css";

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const search = params.get("search") || "";
  const category = params.get("category") || "";

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getProducts(page, { search, category })
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ??
              "Unable to load products."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, category]);

  function goToPage(nextPage) {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading && !result) {
    return <LoadingMessage message="Loading products..." />;
  }

  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="products-page">
      <header className="products-page__header">
        <h1>
          {category
            ? "Category products"
            : search
              ? `Results for “${search}”`
              : "All products"}
        </h1>
      </header>

      {result?.data?.length ? (
        <ProductGrid products={result.data} />
      ) : (
        <EmptyMessage message="No matching products found." />
      )}

      <div className="products-pagination">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => goToPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {result?.last_page ?? 1}</span>
        <button
          type="button"
          disabled={page >= (result?.last_page ?? 1) || loading}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}