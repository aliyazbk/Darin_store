import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./footer";
import "../../styles/components/Layout.css";
function Layout() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-layout__content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;