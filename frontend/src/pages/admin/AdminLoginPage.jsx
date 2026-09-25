import "../../styles/admin/AdminLoginPage.css";
import { useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useAdminAuth from "../../hooks/useAdminAuth";

export default function AdminLoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    login,
    isAuthenticated,
  } = useAdminAuth();

  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

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

      await login(form);

const destination =
  location.state?.from?.pathname ?? "/";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      setError(
        error.response?.data?.errors?.email?.[0] ??
          error.response?.data?.message ??
          "Unable to log in."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <form
        className="admin-login-form"
        onSubmit={handleSubmit}
      >
        <h1>Admin Login</h1>

        {error && (
          <p role="alert">{error}</p>
        )}

        <label htmlFor="admin-email">
          Email
        </label>

        <input
          id="admin-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label htmlFor="admin-password">
          Password
        </label>

        <input
          id="admin-password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}