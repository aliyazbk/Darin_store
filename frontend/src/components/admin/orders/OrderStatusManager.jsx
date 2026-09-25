import { useState } from "react";

import ErrorMessage from "../../ui/ErrorMessage";
import { updateAdminOrderStatus } from "../../../services/adminOrderService";

const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function formatStatus(status) {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

export default function OrderStatusManager({
  order,
  onUpdated,
}) {
  const [updatingStatus, setUpdatingStatus] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const nextStatuses =
    allowedTransitions[order.status] ?? [];

  async function handleUpdate(status) {
    if (
      status === "cancelled" &&
      !window.confirm(
        "Cancel this order and restore its stock?"
      )
    ) {
      return;
    }

    try {
      setUpdatingStatus(status);
      setError("");
      setSuccess("");

      await updateAdminOrderStatus(
        order.id,
        status
      );

      setSuccess(
        `Order changed to ${formatStatus(status)}.`
      );

      onUpdated();
    } catch (error) {
      console.error(
        "Unable to update order status:",
        error
      );

      setError(
        error.response?.data?.errors?.status?.[0] ??
          error.response?.data?.message ??
          "Unable to update order status."
      );
    } finally {
      setUpdatingStatus("");
    }
  }

  return (
    <section>
      <h2>Order status</h2>

      <p>
        Current status:{" "}
        <strong>
          {formatStatus(order.status)}
        </strong>
      </p>

      {success && <p role="status">{success}</p>}
      {error && <ErrorMessage message={error} />}

      {nextStatuses.length === 0 ? (
        <p>This order has no further status changes.</p>
      ) : (
        <div>
          {nextStatuses.map((status) => (
            <button
              key={status}
              type="button"
              disabled={Boolean(updatingStatus)}
              onClick={() => handleUpdate(status)}
            >
              {updatingStatus === status
                ? "Updating..."
                : `Mark as ${formatStatus(status)}`}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}