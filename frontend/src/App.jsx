import {
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/layout/layout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

import HomePage from "./pages/Homepage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/Cartpage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccesPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCreateProductPage from "./pages/admin/AdminCreateProductPage";

import AdminManageProductPage from "./pages/admin/AdminManageProductPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";

function App() {
  return (
    <Routes>
      {/* Customer routes */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/products"
          element={<ProductsPage />}
        />

        <Route
          path="/products/:slug"
          element={<ProductDetailsPage />}
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />

        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccessPage />}
        />
      </Route>

      {/* Public admin route */}
      <Route
        path="/admin/login"
        element={<AdminLoginPage />}/>

      {/* Protected admin routes */}
      <Route element={<ProtectedAdminRoute />}/>

      <Route element={<AdminLayout />}/>

      <Route
        path="/admin"
       element={<AdminDashboardPage />}
     />

      <Route
       path="/admin/products"
        element={<AdminProductsPage />}
      />

      <Route
       path="/admin/products/new"
       element={<AdminCreateProductPage />}
      />

    <Route
      path="/admin/products/:productId"
      element={<AdminManageProductPage />}
    />
      <Route
        path="/admin/orders"
         element={<AdminOrdersPage />}
       />
       <Route
          path="/admin/orders/:orderId"
          element={<AdminOrderDetailsPage />}
      />
      <Route
        path="/admin/categories"
        element={<AdminCategoriesPage />}
      />
  </Routes>
  );
    
      
}

export default App;