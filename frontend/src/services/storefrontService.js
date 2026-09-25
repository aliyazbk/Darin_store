import api from "../api/axios";

export async function getStoreSettings() {
  const response = await api.get("/store-settings");
  return response.data.settings;
}

export async function getHomeCatalog() {
  const response = await api.get("/home/catalog");
  return response.data;
}

export async function getPublicCategories() {
  const response = await api.get("/categories");
  return response.data.categories;
}

export async function saveStoreSettings(formData) {
  const response = await api.post("/admin/store-settings", formData);
  return response.data;
}

export async function getHomeSections() {
  const response = await api.get("/admin/home-sections");
  return response.data.sections;
}

export async function createHomeSection(data) {
  const response = await api.post("/admin/home-sections", data);
  return response.data;
}

export async function updateHomeSection(id, data) {
  const response = await api.put(`/admin/home-sections/${id}`, data);
  return response.data;
}

export async function deleteHomeSection(id) {
  const response = await api.delete(`/admin/home-sections/${id}`);
  return response.data;
}