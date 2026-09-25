import api from "../api/axios";

export async function getAdminCategories() {
  const response = await api.get("/admin/categories");
  return response.data.categories;
}

export async function createAdminCategory(data) {
  const response = await api.post(
    "/admin/categories",
    data
  );

  return response.data;
}

export async function updateAdminCategory(id, data) {
  const response = await api.put(
    `/admin/categories/${id}`,
    data
  );

  return response.data;
}