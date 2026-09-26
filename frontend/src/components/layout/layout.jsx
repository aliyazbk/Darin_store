import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./footer";
import "../../styles/components/Layout.css";

function Layout() {
  const isAdminPage = useLocation().pathname.startsWith("/admin");

  return (
    <div className="app-layout">
      <Navbar />

      <main
        className={`app-layout__content ${
          isAdminPage ? "admin-content" : ""
        }`}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;