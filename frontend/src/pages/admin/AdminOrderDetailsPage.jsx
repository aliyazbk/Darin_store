import {
  Link,
  useParams,
} from "react-router-dom";

import useAdminOrder from "../../hooks/useAdminOrder";
import LoadingMessage from "../../components/ui/LoadingMessage";
import ErrorMessage from "../../components/ui/ErrorMessage";
import OrderStatusManager from "../../components/admin/orders/OrderStatusManager";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();

  const {
    order,
    loading,
    error,
    refresh,
  } = useAdminOrder(orderId);

  if (loading) {
    return (
      <LoadingMessage message="Loading order..." />
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!order) {
    return (
      <ErrorMessage message="Order not found." />
    );
  }

  return (
    <main className="admin-order-details-page">
      <header>
        <Link to="/admin/orders">
          Back to orders
        </Link>

        <h1>
          Order{" "}
          {order.order_number ?? `#${order.id}`}
        </h1>

        <p>
          {new Date(order.created_at).toLocaleString()}
        </p>
      </header>

      <OrderStatusManager
        order={order}
        onUpdated={refresh}
      />

      <section>
        <h2>Customer</h2>

        <dl>
          <dt>Name</dt>
          <dd>{order.customer_name}</dd>

          <dt>Phone</dt>
          <dd>{order.phone}</dd>

          <dt>Email</dt>
          <dd>{order.email || "—"}</dd>
        </dl>
      </section>

      <section>
        <h2>Delivery address</h2>

        <address>
          {order.governorate}, {order.city}
          <br />

          {order.street_name && (
            <>
              {order.street_name}
              <br />
            </>
          )}

          {order.address}

          {order.landmark && (
            <>
              <br />
              Landmark: {order.landmark}
            </>
          )}
        </address>
      </section>

      {order.customer_note && (
        <section>
          <h2>Customer note</h2>
          <p>{order.customer_note}</p>
        </section>
      )}

      <section>
        <h2>Items</h2>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Variant</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.sku}</td>

                <td>
                  {item.size} / {item.color}
                </td>

                <td>
                  {formatCurrency(item.unit_price)}
                </td>

                <td>{item.quantity}</td>

                <td>
                  {formatCurrency(item.line_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Totals</h2>

        <dl>
          <dt>Subtotal</dt>
          <dd>{formatCurrency(order.subtotal)}</dd>

          <dt>Delivery fee</dt>
          <dd>
            {formatCurrency(order.delivery_fee)}
          </dd>

          <dt>Total</dt>
          <dd>
            <strong>
              {formatCurrency(order.total)}
            </strong>
          </dd>
        </dl>

        <p>Payment: Cash on delivery</p>
      </section>
    </main>
  );
}