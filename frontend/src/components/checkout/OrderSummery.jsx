export default function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  total,
}) {
  return (
    <aside className="order-summary">
      <h2>Order summary</h2>

      <div className="summary-items">
        {items.map((item) => (
          <div
            className="summary-item"
            key={item.product_variant_id}
          >
            <div>
              <strong>{item.product_name}</strong>

              <p>
                Size: {item.size} | Color: {item.color}
              </p>

              <p>Quantity: {item.quantity}</p>
            </div>

            <span>
              ${(Number(item.unit_price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>${Number(subtotal).toFixed(2)}</span>
      </div>

      <div className="summary-row">
        <span>Delivery</span>
        <span>${Number(deliveryFee).toFixed(2)}</span>
      </div>

      <div className="summary-row summary-total">
        <strong>Total</strong>
        <strong>${Number(total).toFixed(2)}</strong>
      </div>

      <p className="payment-note">Payment: cash on delivery</p>
    </aside>
  );
}