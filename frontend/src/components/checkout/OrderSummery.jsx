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
       {items.map((item, index) => {
            const productName =
              item.product_name ??
              item.name ??
              item.product?.name ??
              "Product";
                
            const price = Number(
              item.unit_price ??
              item.price ??
              item.variant?.price ??
              0
            );
          
            return (
              <div
                className="summary-item"
                key={item.product_variant_id ?? item.variant_id ?? index}
              >
                <div>
                  <strong>{productName}</strong>
            
                  <p>
                    Size: {item.size ?? item.variant?.size} | Color:{" "}
                    {item.color ?? item.variant?.color}
                  </p>
            
                  <p>Quantity: {item.quantity}</p>
                </div>
            
                  <span>
                    ${Number(
                      item.line_total ?? price * Number(item.quantity)
                    ).toFixed(2)}
                  </span>
              </div>
            );
          })}
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