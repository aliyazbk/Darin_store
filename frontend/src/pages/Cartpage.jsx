import { Link } from "react-router-dom";

import useCart from "../hooks/useCart";
import CartList from "../components/cart/CartList";
import CartSummary from "../components/cart/CartSummary";
import EmptyMessage from "../components/ui/EmptyMessage";

function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <h1>Your Cart</h1>

        <EmptyMessage message="Your cart is currently empty." />

        <Link to="/products">Continue shopping</Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <header>
        <h1>Your Cart</h1>
        <p>
          {items.length} different product variant(s)
        </p>
      </header>

      <div className="cart-page__content">
        <CartList
          items={items}
          onQuantityChange={updateQuantity}
          onRemove={removeItem}
        />

        <CartSummary subtotal={subtotal} />
      </div>
    </section>
  );
}

export default CartPage;