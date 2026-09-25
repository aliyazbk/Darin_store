import { Link } from "react-router-dom";

import useAdminAuth from "../../hooks/useAdminAuth";
import useAdminDashboard from "../../hooks/useAdminDashboard";

import LoadingMessage from "../../components/ui/LoadingMessage";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminDashboardPage() {
const {
  admin,
  loading: adminLoading,
} = useAdminAuth();

  const {
    statistics,
    recentOrders,
    loading,
    error,
  } = useAdminDashboard();

if (loading || adminLoading) {
    return (
      <LoadingMessage message="Loading dashboard..." />
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main className="admin-dashboard-page">
      <header>
        <h1>Dashboard</h1>
       <p>Welcome, {admin?.name ?? "Admin"}</p>
      </header>
      <section className="admin-quick-actions">
  <h2>Management</h2>

  <div className="admin-quick-actions__grid">
    <Link
      className="admin-quick-action"
      to="/admin/products"
    >
      <strong>Products</strong>
      <span>
        View, edit, activate, and manage products
      </span>
    </Link>

    <Link
      className="admin-quick-action"
      to="/admin/products/new"
    >
      <strong>Add Product</strong>
      <span>
        Create a product with its first variants
      </span>
    </Link>

    <Link
      className="admin-quick-action"
      to="/admin/categories"
    >
      <strong>Categories</strong>
      <span>
        Create and update store categories
      </span>
    </Link>

    <Link
      className="admin-quick-action"
      to="/admin/orders"
    >
      <strong>Orders</strong>
      <span>
        Review orders and update their status
      </span>
    </Link>

    <Link
      className="admin-quick-action"
      to="/products"
      target="_blank"
      rel="noreferrer"
    >
      <strong>View Store</strong>
      <span>
        Open the customer storefront
      </span>
    </Link>
  </div>
</section>
      <section>
        <h2>Store overview</h2>

        <div className="admin-statistics">
          <article>
            <h3>Total products</h3>
            <p>{statistics.total_products}</p>
          </article>

          <article>
            <h3>Active products</h3>
            <p>{statistics.active_products}</p>
          </article>

          <article>
            <h3>Pending orders</h3>
            <p>{statistics.pending_orders}</p>
          </article>

          <article>
            <h3>Low-stock variants</h3>
            <p>{statistics.low_stock_variants}</p>
          </article>

          <article>
            <h3>Delivered orders</h3>
            <p>{statistics.delivered_orders}</p>
          </article>

          <article>
            <h3>Revenue</h3>
            <p>
              {formatCurrency(
                statistics.total_revenue
              )}
            </p>
          </article>
        </div>
      </section>

      <section>
        <header>
          <h2>Recent orders</h2>

          <Link to="/admin/orders">
            View all orders
          </Link>
        </header>

        {recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.order_number ??
                      `#${order.id}`}
                  </td>

                  <td>{order.customer_name}</td>

                  <td>
                    {formatCurrency(order.total)}
                  </td>

                  <td>{order.status}</td>

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
      </section>
    </main>
  );
} 