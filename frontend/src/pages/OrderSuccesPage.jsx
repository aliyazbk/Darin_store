import { Link, Navigate, useLocation } from "react-router-dom";
import "../styles/pages/OrderSuccesPage.css";

export default function OrderSuccessPage() {
  const location = useLocation();

  // Supports either { order: {...} } or a direct order response.
  const response = location.state?.order;
  const order = response?.order ?? response;

  if (!order) {
    return <Navigate to="/products" replace />;
  }

  const orderReference =
    order.order_number ?? order.reference ?? order.id;

  return (
    <main className="order-success-page">
      <section className="success-card">
        <div className="success-icon" aria-hidden="true">
          <span>✓</span>
        </div>

        <p className="success-label">Order confirmed</p>

        <h1>Thank you for your order</h1>

        <p className="success-message">
          We received your order and will contact you before delivery.
          Payment will be collected in cash when your order arrives.
        </p>

        <div className="order-reference">
          <span>Order reference</span>
          <strong>#{orderReference}</strong>
        </div>

        <div className="success-details">
          <div>
            <span>Customer</span>
            <strong>{order.customer_name}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{order.phone}</strong>
          </div>

          {order.total && (
            <div>
              <span>Total</span>
              <strong>${Number(order.total).toFixed(2)}</strong>
            </div>
          )}

          <div>
            <span>Payment</span>
            <strong>Cash on delivery</strong>
          </div>
        </div>

        <Link className="continue-shopping-button" to="/products">
          Continue shopping
        </Link>
      </section>
    </main>
  );
}