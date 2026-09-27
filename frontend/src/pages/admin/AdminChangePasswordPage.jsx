import { useState } from "react";

import { changeAdminPassword } from "../../services/adminAuthService";

export default function AdminChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await changeAdminPassword(form);

      setSuccess("Password updated successfully.");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (requestError) {
      const validationErrors = requestError.response?.data?.errors;

      setError(
        validationErrors
          ? Object.values(validationErrors).flat().join(" ")
          : requestError.response?.data?.message ??
              "Unable to update password."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-change-password-page">
      <form
        className="admin-change-password-form"
        onSubmit={handleSubmit}
      >
        <h1>Change password</h1>

        {success && <p role="status">{success}</p>}
        {error && <p role="alert">{error}</p>}

        <label htmlFor="current-password">
          Current password
        </label>

        <input
          id="current-password"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <label htmlFor="new-password">
          New password
        </label>

        <input
          id="new-password"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
          required
        />

        <label htmlFor="confirm-password">
          Confirm new password
        </label>

        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </main>
  );
}
