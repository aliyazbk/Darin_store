import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/Products/ProductGrid";
import LoadingMessage from "../components/ui/LoadingMessage";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyMessage from "../components/ui/EmptyMessage";
import "../styles/pages/ProductPage.css";

function ProductList({ search, category }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    getProducts(page, { search, category })
      .then((result) => {
        if (cancelled) return;

        setProducts((current) =>
          page === 1
            ? result.data
            : [...current, ...result.data]
        );
        setLastPage(result.last_page);
        setError("");
      })
      .catch((requestError) => {
        if (cancelled) return;

        setError(
          requestError.response?.data?.message ??
            "Unable to load products."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, category, retry]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || loading || error || lastPage === null || page >= lastPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setLoading(true);
          setPage((current) => current + 1);
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [loading, error, lastPage, page, products.length]);

  if (loading && page === 1 && products.length === 0) {
    return <LoadingMessage message="Loading products..." />;
  }

  if (error && products.length === 0) {
    return (
      <div>
        <ErrorMessage message={error} />
        <button type="button" onClick={() => {
          setError("");
          setLoading(true);
          setRetry((current) => current + 1);
        }}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyMessage message="No matching products found." />
      )}

      {loading && page > 1 && (
        <LoadingMessage message="Loading more products..." />
      )}

      {error && products.length > 0 && (
        <div>
          <ErrorMessage message={error} />
          <button type="button" onClick={() => {
            setError("");
            setLoading(true);
            setRetry((current) => current + 1);
          }}>
            Try again
          </button>
        </div>
      )}

      {/* Reaching this element loads the next page. */}
      <div ref={loadMoreRef} aria-hidden="true" />
    </>
  );
}

export default function ProductsPage() {
  const [params] = useSearchParams();
  const search = params.get("search") || "";
  const category = params.get("category") || "";

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

      <ProductList
        key={JSON.stringify([search, category])}
        search={search}
        category={category}
      />
    </section>
  );
}