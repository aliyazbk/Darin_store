import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import useCheckout from "../hooks/useCheckout";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummery";
import "./../styles/pages/CheckoutPage.css";

const initialFormData = {
  customer_name: "",
  phone: "",
  email: "",
  governorate: "",
  city: "",
  address: "",
  notes: "",
};

const DELIVERY_FEE = 5;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { submitOrder, isSubmitting, errors, generalError } =
    useCheckout();

  const [formData, setFormData] = useState(initialFormData);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.unit_price) * Number(item.quantity),
      0
    );
  }, [cartItems]);

  const total = subtotal + DELIVERY_FEE;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const orderData = {
      ...formData,

      // Do not send an empty optional email.
      email: formData.email.trim() || null,

      items: cartItems.map((item) => ({
        product_variant_id: item.product_variant_id,
        quantity: Number(item.quantity),
      })),
    };

    try {
      const createdOrder = await submitOrder(orderData);

      clearCart();

      navigate("/order-success", {
        replace: true,
        state: {
          order: createdOrder,
        },
      });
    } catch {
      // useCheckout already stores the Laravel error messages.
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="empty-checkout">
        <h1>Your cart is empty</h1>
        <p>Add products to your cart before checking out.</p>
        <Link to="/products">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your order and pay when it is delivered.</p>
      </header>

      <div className="checkout-layout">
        <CheckoutForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={errors}
          generalError={generalError}
          isSubmitting={isSubmitting}
        />

        <OrderSummary
          items={cartItems}
          subtotal={subtotal}
          deliveryFee={DELIVERY_FEE}
          total={total}
        />
      </div>
    </main>
  );
}