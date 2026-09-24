import api from "../api/axios";

export async function getProducts(page = 1) {
  const response = await api.get("/products", {
    params: { page },
  });

  return response.data;
}

export async function getProductBySlug(slug) {
  const response = await api.get(`/products/${slug}`);

  return response.data;
}