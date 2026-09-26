import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useCart from "../hooks/useCart";
import useCheckout from "../hooks/useCheckout";
import { previewOrder } from "../services/checkoutService";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummery";

import "../styles/pages/CheckoutPage.css";

const initialFormData = {
  customer_name: "",
  phone: "",
  email: "",
  governorate: "",
  city: "",
  street_name: "",
  address: "",
  notes: "",
};

function orderItems(cartItems) {
  return cartItems.map((item) => ({
    variant_id:
      item.variant_id ??
      item.product_variant_id ??
      item.variantId ??
      item.variant?.id,
    quantity: Number(item.quantity),
  }));
}

function requestMessage(error) {
  return (
    Object.values(error.response?.data?.errors ?? {})
      .flat()
      .join(" ") ||
    error.response?.data?.message ||
    "Unable to check the current prices."
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items: cartItems = [], clearCart } = useCart();
  const { submitOrder, isSubmitting, errors, generalError } =
    useCheckout();

  const [formData, setFormData] = useState(initialFormData);
  const [quote, setQuote] = useState(null);
  const [reviewedItems, setReviewedItems] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const items = useMemo(
    () => orderItems(cartItems),
    [cartItems]
  );

  const fingerprint = JSON.stringify(items);
  const quoteIsCurrent =
    quote && reviewedItems === fingerprint;

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleReview(event) {
    event.preventDefault();
    setReviewing(true);
    setReviewError("");
    setQuote(null);

    try {
      const nextQuote = await previewOrder(items);
      setQuote(nextQuote);
      setReviewedItems(fingerprint);
    } catch (error) {
      setReviewError(requestMessage(error));
    } finally {
      setReviewing(false);
    }
  }

  async function handleConfirm() {
    if (!quoteIsCurrent) return;

    setReviewError("");

    try {
      const createdOrder = await submitOrder({
        ...formData,
        email: formData.email.trim() || null,
        customer_note: formData.notes,
        items,
        expected_total: quote.total,
      });

      clearCart();

      navigate("/order-success", {
        replace: true,
        state: { order: createdOrder },
      });
    } catch (error) {
      setQuote(null);
      setReviewError(requestMessage(error));
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
        <p>
          Review the current price before placing your
          cash-on-delivery order.
        </p>
      </header>

      {reviewError && (
        <div className="checkout-error" role="alert">
          {reviewError}
        </div>
      )}

      <div className="checkout-layout">
        <div>
          <CheckoutForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleReview}
            errors={errors}
            generalError={generalError}
            isSubmitting={reviewing}
            buttonText="Review current prices"
          />

          {quoteIsCurrent && (
            <div className="checkout-review" role="status">
              <h2>Confirm your order</h2>
              <p>
                These prices and the delivery fee were
                calculated by the store.
              </p>

              <button
                type="button"
                className="place-order-button"
                disabled={isSubmitting}
                onClick={handleConfirm}
              >
                {isSubmitting
                  ? "Placing order..."
                  : "Confirm cash-on-delivery order"}
              </button>
            </div>
          )}
        </div>

        {quoteIsCurrent && (
          <OrderSummary
            items={quote.items}
            subtotal={quote.subtotal}
            deliveryFee={quote.delivery_fee}
            total={quote.total}
          />
        )}
      </div>
    </main>
  );
}