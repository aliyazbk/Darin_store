import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export async function createOrder(orderData) {
  const response = await axios.post(`${API_URL}/orders`, orderData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
export async function previewOrder(items) {
  const response = await axios.post(
    `${API_URL}/orders/preview`,
    { items },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data.quote;
}