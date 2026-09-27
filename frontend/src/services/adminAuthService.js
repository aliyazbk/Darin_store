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

export async function changeAdminPassword(passwordData) {
  const response = await api.put("/admin/password", {
    current_password: passwordData.currentPassword,
    password: passwordData.newPassword,
    password_confirmation: passwordData.confirmPassword,
  });

  return response.data;
}