import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

function CartSummary({ subtotal }) {
  return (
    <aside className="cart-summary">
      <h2>Order Summary</h2>

      <div>
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>

      <p>Delivery fees will be calculated at checkout.</p>

      <Link to="/checkout">
        Continue to checkout
      </Link>
    </aside>
  );
}

export default CartSummary;