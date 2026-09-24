import { Route, Routes } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccesPage";
import Layout from "./components/layout/layout";
import HomePage from "./pages/Homepage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/Cartpage";

function App() {
  return (
    <Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<HomePage />} />

    <Route
      path="/products"
      element={<ProductsPage />}
    />
    <Route path="/checkout" element={<CheckoutPage />} />

   <Route path="/order-success" element={<OrderSuccessPage />} />

    <Route
      path="/products/:slug"
      element={<ProductDetailsPage />}
    />

    <Route path="/cart" element={<CartPage />} />
  </Route>
</Routes>
  );
}

export default App;