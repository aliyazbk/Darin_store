import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import ProductForm from "../../components/admin/products/ProductForm";
import LoadingMessage from "../../components/ui/LoadingMessage";
import ErrorMessage from "../../components/ui/ErrorMessage";

import useAdminCategories from "../../hooks/useAdminCategories";
import { createAdminProduct } from "../../services/adminProductService";

export default function AdminCreateProductPage() {
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] =
    useState({});

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAdminCategories();

  const navigate = useNavigate();

  async function handleSubmit(productData) {
    try {
      setSubmitting(true);
      setError("");
      setValidationErrors({});

      const result = await createAdminProduct(
        productData
      );

      navigate(
        `/admin/products/${result.product.id}`,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Unable to create product:",
        error
      );

      if (
        error.response?.status === 422
      ) {
        setValidationErrors(
          error.response.data.errors ?? {}
        );
      } else {
        setError(
          error.response?.data?.message ??
            "Unable to create product."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (categoriesLoading) {
    return (
      <LoadingMessage message="Loading product form..." />
    );
  }

  if (categoriesError) {
    return (
      <ErrorMessage message={categoriesError} />
    );
  }

  return (
    <main className="admin-create-product-page">
      <header>
        <div>
          <Link to="/admin/products">
            Back to products
          </Link>

          <h1>Add Product</h1>
        </div>
      </header>

      {error && (
        <ErrorMessage message={error} />
      )}

      <ProductForm
        categories={categories}
        includeVariants
        submitting={submitting}
        validationErrors={validationErrors}
        submitLabel="Create product"
        onSubmit={handleSubmit}
      />
    </main>
  );
}