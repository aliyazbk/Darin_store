import "../../styles/admin/AdminLayout.css";
import "../../styles/admin/AdminPages.css";import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import useAdminAuth from "../../hooks/useAdminAuth";

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();

    navigate("/admin/login", {
      replace: true,
    });
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div>
          <strong>Darin Store Admin</strong>
          <span>{admin.name}</span>
        </div>

        <nav aria-label="Admin navigation">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin/products">
            Products
          </NavLink>

          <NavLink to="/admin/orders">
            Orders
          </NavLink>
          <NavLink to="/admin/categories">
               Categories
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}