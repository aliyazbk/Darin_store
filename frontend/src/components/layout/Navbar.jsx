import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import useCart from "../../hooks/useCart";
import useAdminAuth from "../../hooks/useAdminAuth";
import {
  getPublicCategories,
  getStoreSettings,
} from "../../services/storefrontService";

export default function Navbar() {
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    Promise.all([getPublicCategories(), getStoreSettings()])
      .then(([categoryList, storeSettings]) => {
        setCategories(categoryList);
        setSettings(storeSettings);
      })
      .catch((error) => {
        console.error("Unable to load store navigation:", error);
      });
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/", { replace: true });
  }

  function handleSearch(event) {
    event.preventDefault();
    const term = search.trim();
    if (!term) return;

    navigate(`/products?search=${encodeURIComponent(term)}`);
  }

  return (
    <header className="store-header">
      <div className="store-navbar">
        <button
          type="button"
          className={`store-icon-button store-menu-toggle ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="store-drawer"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="menu-line" aria-hidden="true" />
          <span className="menu-line" aria-hidden="true" />
          <span className="menu-line" aria-hidden="true" />
        </button>

        <Link to="/" className="store-logo" aria-label="Darin Clothet home">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Darin Clothet" />
          ) : (
            <span>Darin Clothet</span>
          )}
        </Link>

        <div className="store-navbar-actions">
          <button
            type="button"
            className="store-icon-button"
            aria-label="Search products"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((current) => !current)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="7" />
              <path d="m16 16 5 5" />
            </svg>
          </button>

          <Link
            to="/cart"
            className="store-icon-button store-cart-link"
            aria-label={`Cart, ${itemCount} items`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16l-1 14H5L4 7Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            {itemCount > 0 && (
              <span className="store-cart-count">{itemCount}</span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form className="store-search" onSubmit={handleSearch}>
          <input
            autoFocus
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>
      )}

      {open && (
        <button
          type="button"
          className="store-drawer-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <nav
        id="store-drawer"
        className={`store-drawer ${open ? "is-open" : ""}`}
        aria-label="Store navigation"
        aria-hidden={!open}
      >
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Shop all</NavLink>

        <button
          type="button"
          className="store-drawer-expand"
          aria-expanded={categoriesOpen}
          onClick={() => setCategoriesOpen((current) => !current)}
        >
          Categories <span>{categoriesOpen ? "−" : "+"}</span>
        </button>

        {categoriesOpen && (
          <div className="store-drawer-submenu">
            {categories.map((category) => (
              <NavLink
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.slug)}`}
              >
                {category.name}
              </NavLink>
            ))}
          </div>
        )}

        <NavLink to="/about">About us</NavLink>

        {isAuthenticated && (
          <>
            <div className="store-drawer-heading">Admin</div>
            <NavLink to="/admin">Dashboard</NavLink>
            <NavLink to="/admin/products">Manage products</NavLink>
            <NavLink to="/admin/products/new">Add product</NavLink>
            <NavLink to="/admin/categories">Categories</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>
            <NavLink to="/admin/storefront">Storefront settings</NavLink>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}