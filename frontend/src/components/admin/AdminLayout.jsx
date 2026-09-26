import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import useAdminAuth from "../../hooks/useAdminAuth";
import "../../styles/admin/AdminLayout.css";
import "../../styles/admin/AdminPages.css";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/orders", "Orders"],
  ["/admin/storefront", "Storefront"],
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  }

  return (
    <div className={`admin-layout ${open ? "sidebar-open" : ""}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <button
            type="button"
            className="admin-sidebar-toggle"
            aria-label={open ? "Collapse admin menu" : "Expand admin menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>

          {open && (
            <div className="admin-sidebar-brand">
              <strong>Darin</strong>
              <span>Store management</span>
            </div>
          )}
        </div>

        <nav aria-label="Admin navigation">
          {links.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              title={open ? undefined : label}
              onClick={() => {
                if (window.innerWidth <= 700) setOpen(false);
              }}
            >
              <span className="admin-nav-mark" aria-hidden="true">
                {label[0]}
              </span>
              {open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          {open && <span>{admin?.name}</span>}

          <button type="button" title="Sign out" onClick={handleLogout}>
            {open ? "Sign out" : "↗"}
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}