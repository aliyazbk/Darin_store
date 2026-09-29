import { useState } from "react";
import { Link } from "react-router-dom";

import useAdminProducts from "../../hooks/useAdminProducts";
import LoadingMessage from "../../components/ui/LoadingMessage";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyMessage from "../../components/ui/EmptyMessage";

export default function AdminProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    products,
    pagination,
    loading,
    error,
  } = useAdminProducts({
    page,
    search,
  });

  function handleSearch(event) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <main className="admin-products-page">
      <header>
        <div>
          <h1>Products</h1>

          {pagination && (
            <p>{pagination.total} products</p>
          )}
        </div>

        <Link to="/admin/products/new">
          Add product
        </Link>
      </header>

      <form onSubmit={handleSearch}>
        <label htmlFor="product-search">
          Search products
        </label>

        <input
          id="product-search"
          type="search"
          value={searchInput}
          onChange={(event) =>
            setSearchInput(event.target.value)
          }
        />

        <button type="submit">Search</button>
      </form>

      {loading && (
        <LoadingMessage message="Loading products..." />
      )}

      {!loading && error && (
        <ErrorMessage message={error} />
      )}

      {!loading &&
        !error &&
        products.length === 0 && (
          <EmptyMessage message="No products found." />
        )}

      {!loading &&
        !error &&
        products.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Variants</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="product-row">
                  <td>
                    {product.name}
                    <Link
                      className="mobile-row-action"
                      to={`/admin/products/${product.id}`}
                    >
                      Manage
                    </Link>
                  </td>

                  <td>
                    {product.category?.name ?? "—"}
                  </td>

                  <td>
                    ${Number(
                      product.base_price
                    ).toFixed(2)}
                  </td>

                  <td>
                    {product.variants?.length ?? 0}
                  </td>

                  <td>
                    {product.is_active
                      ? "Active"
                      : "Inactive"}
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        )}

      {pagination?.lastPage > 1 && (
        <nav aria-label="Product pages">
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage((current) => current - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {pagination.currentPage} of{" "}
            {pagination.lastPage}
          </span>

          <button
            type="button"
            disabled={
              page === pagination.lastPage
            }
            onClick={() =>
              setPage((current) => current + 1)
            }
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}