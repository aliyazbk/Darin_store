import { useState } from "react";
import { Link } from "react-router-dom";

import LoadingMessage from "../../components/ui/LoadingMessage";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyMessage from "../../components/ui/EmptyMessage";
import { formatCurrency } from "../../utils/formatCurrency";
import useAdminOrders from "../../hooks/useAdminOrders.js";

export default function AdminOrdersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const {
    orders,
    pagination,
    loading,
    error,
  } = useAdminOrders({
    page,
    search,
    status,
  });

  function handleSearch(event) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleStatusChange(event) {
    setPage(1);
    setStatus(event.target.value);
  }

  return (
    <main className="admin-orders-page">
      <header>
        <h1>Orders</h1>

        {pagination && (
          <p>{pagination.total} orders</p>
        )}
      </header>

      <form onSubmit={handleSearch}>
        <label htmlFor="order-search">
          Search orders
        </label>

        <input
          id="order-search"
          type="search"
          placeholder="Order, customer, phone or email"
          value={searchInput}
          onChange={(event) =>
            setSearchInput(event.target.value)
          }
        />

        <button type="submit">Search</button>
      </form>

      <label htmlFor="order-status">
        Status
      </label>

      <select
        id="order-status"
        value={status}
        onChange={handleStatusChange}
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {loading && (
        <LoadingMessage message="Loading orders..." />
      )}

      {!loading && error && (
        <ErrorMessage message={error} />
      )}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <EmptyMessage message="No orders found." />
        )}

      {!loading &&
        !error &&
        orders.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.order_number ??
                      `#${order.id}`}
                  </td>

                  <td>
                    <strong>
                      {order.customer_name}
                    </strong>
                    <br />
                    {order.phone}
                  </td>

                  <td>{order.items_count}</td>

                  <td>
                    {formatCurrency(order.total)}
                  </td>

                  <td>{order.status}</td>

                  <td>
                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <Link
                      to={`/admin/orders/${order.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      {pagination?.lastPage > 1 && (
        <nav aria-label="Order pages">
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