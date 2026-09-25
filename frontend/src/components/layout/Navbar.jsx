import { Link, NavLink } from "react-router-dom";
import useCart from "../../hooks/useCart";

function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        Darin clothet
      </Link>

      <nav aria-label="Main navigation">
        <ul className="navbar__links">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>

          <li>
            <NavLink to="/products">Shop</NavLink>
          </li>

          <li>
            <NavLink to="/cart">
              Cart ({itemCount})
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;