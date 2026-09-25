import api from "../api/axios";

export async function getAdminOrders(params = {}) {
  const response = await api.get("/admin/orders", {
    params,
  });

  return response.data;
}

export async function getAdminOrder(orderId) {
  const response = await api.get(
    `/admin/orders/${orderId}`
  );

  return response.data.order;
}

export async function updateAdminOrderStatus(
  orderId,
  status
) {
  const response = await api.patch(
    `/admin/orders/${orderId}/status`,
    { status }
  );

  return response.data;
}