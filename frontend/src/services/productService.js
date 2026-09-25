import api from "../api/axios";

export async function getProducts(page = 1, filters = {}) {
  const response = await api.get("/products", {
    params: { page, ...filters },
  });

  return response.data;
}

export async function getProductBySlug(slug) {
  if (!slug) {
    throw new Error("Product slug is required.");
  }

  const response = await api.get(
    `/products/${encodeURIComponent(slug)}`
  );

  return response.data;
}