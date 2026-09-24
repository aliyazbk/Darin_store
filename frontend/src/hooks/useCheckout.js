import { useState } from "react";
import { createOrder } from "../services/checkoutService";

export default function useCheckout() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  async function submitOrder(orderData) {
    setIsSubmitting(true);
    setErrors({});
    setGeneralError("");

    try {
      return await createOrder(orderData);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors ?? {});
      } else {
        setGeneralError(
          error.response?.data?.message ||
            "We could not place your order. Please try again."
        );
      }

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitOrder,
    isSubmitting,
    errors,
    generalError,
  };
}