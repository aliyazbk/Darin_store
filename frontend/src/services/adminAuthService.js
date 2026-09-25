import api from "../api/axios";

export async function loginAdmin(credentials) {
  const response = await api.post(
    "/admin/login",
    credentials
  );

  return response.data;
}

export async function getCurrentAdmin() {
  const response = await api.get("/admin/me");

  return response.data.admin;
}

export async function logoutAdmin() {
  const response = await api.post("/admin/logout");

  return response.data;
}