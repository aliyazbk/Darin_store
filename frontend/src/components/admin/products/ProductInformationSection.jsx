import { useState } from "react";

import ProductForm from "./ProductForm";
import ErrorMessage from "../../ui/ErrorMessage";

import { updateAdminProduct } from "../../../services/adminProductService";

export default function ProductInformationSection({
  product,
  categories,
  onUpdated,
}) {
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] =
    useState({});

  async function handleSubmit(productData) {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      setValidationErrors({});

      await updateAdminProduct(
        product.id,
        productData
      );

      setSuccess("Product updated successfully.");
      onUpdated();
    } catch (error) {
      console.error(
        "Unable to update product:",
        error
      );

      if (error.response?.status === 422) {
        setValidationErrors(
          error.response.data.errors ?? {}
        );
      } else {
        setError(
          error.response?.data?.message ??
            "Unable to update product."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Product information</h2>

      {success && (
        <p role="status">{success}</p>
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      <ProductForm
        categories={categories}
        initialProduct={product}
        submitting={submitting}
        validationErrors={validationErrors}
        submitLabel="Update product"
        onSubmit={handleSubmit}
      />
    </section>
  );
}