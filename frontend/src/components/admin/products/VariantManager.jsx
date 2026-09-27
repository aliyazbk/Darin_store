import { useState } from "react";

import VariantForm from "./VariantForm";
import QuickColorImageUpload from "./QuickColorImageUpload";
import ErrorMessage from "../../ui/ErrorMessage";

import {
  createProductVariant,
  deactivateProductVariant,
  updateProductVariant,
  uploadProductImage,
} from "../../../services/adminProductService";

export default function VariantManager({
  productId,
  variants,
  images = [],
  onUpdated,
}) {
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFormKey, setNewFormKey] = useState(0);

  const colorsWithoutSwatch = [
    ...new Set(
      variants
        .filter((variant) => variant.is_active)
        .map((variant) => variant.color)
        .filter(Boolean)
    ),
  ].filter(
    (color) => !images.some((image) => image.color === color)
  );

  async function handleQuickImageUpload(imageData) {
    try {
      setAction(`swatch-${imageData.color}`);
      setError("");
      setSuccess("");

      await uploadProductImage(productId, imageData);

      setSuccess(`Photo added for ${imageData.color}.`);
      onUpdated();
    } catch (requestError) {
      handleError(requestError);
    } finally {
      setAction("");
    }
  }

  function handleError(requestError) {
    console.error("Variant request failed:", requestError);

    const validationErrors = requestError.response?.data?.errors;

    setError(
      validationErrors
        ? Object.values(validationErrors).flat().join(" ")
        : requestError.response?.data?.message ??
            "Unable to save variant."
    );
  }

  async function handleCreate(variantData) {
    try {
      setAction("create");
      setError("");
      setSuccess("");

      await createProductVariant(productId, variantData);

      setSuccess("Option added successfully.");
      setNewFormKey((key) => key + 1);
      setShowAddForm(false);
      onUpdated();
    } catch (requestError) {
      handleError(requestError);
    } finally {
      setAction("");
    }
  }

  async function handleUpdate(variantId, variantData) {
    try {
      setAction(`update-${variantId}`);
      setError("");
      setSuccess("");

      await updateProductVariant(
        productId,
        variantId,
        variantData
      );

      setSuccess("Option updated successfully.");
      setEditingId(null);
      onUpdated();
    } catch (requestError) {
      handleError(requestError);
    } finally {
      setAction("");
    }
  }

  async function handleDeactivate(variantId) {
    if (!window.confirm("Deactivate this option?")) return;

    try {
      setAction(`delete-${variantId}`);
      setError("");
      setSuccess("");

      await deactivateProductVariant(productId, variantId);

      setSuccess("Option deactivated successfully.");
      setEditingId(null);
      onUpdated();
    } catch (requestError) {
      handleError(requestError);
    } finally {
      setAction("");
    }
  }

  return (
    <section>
      <h2>Sizes and colors</h2>

      {success && <p role="status">{success}</p>}
      {error && <ErrorMessage message={error} />}

      {colorsWithoutSwatch.length > 0 && (
        <div role="alert">
          <p>
            These colors have no swatch photo yet, so
            shoppers will see a plain letter icon instead:
          </p>

          {colorsWithoutSwatch.map((color) => (
            <div key={color}>
              <QuickColorImageUpload
                color={color}
                submitting={action === `swatch-${color}`}
                onSubmit={handleQuickImageUpload}
              />
            </div>
          ))}
        </div>
      )}

      {variants.length === 0 && (
        <p>No sizes or colors have been added yet.</p>
      )}

      {variants.map((variant) => (
        <article key={variant.id}>
          <div>
            <h3>
              {variant.size} / {variant.color}
            </h3>
            <p>
              Stock: {variant.stock_quantity}
              {variant.price != null
                ? ` · Custom price: ${variant.price}`
                : " · Uses product price"}
              {!variant.is_active && " · Inactive"}
            </p>

            <button
              type="button"
              onClick={() =>
                setEditingId(
                  editingId === variant.id ? null : variant.id
                )
              }
            >
              {editingId === variant.id ? "Cancel" : "Edit"}
            </button>
          </div>

          {editingId === variant.id && (
            <>
              <VariantForm
                key={variant.id}
                initialVariant={variant}
                submitLabel="Save changes"
                submitting={action === `update-${variant.id}`}
                onSubmit={(variantData) =>
                  handleUpdate(variant.id, variantData)
                }
              />

              {variant.is_active && (
                <button
                  type="button"
                  disabled={action === `delete-${variant.id}`}
                  onClick={() => handleDeactivate(variant.id)}
                >
                  Deactivate option
                </button>
              )}
            </>
          )}
        </article>
      ))}

      <button
        type="button"
        onClick={() => setShowAddForm((current) => !current)}
      >
        {showAddForm ? "Cancel" : "Add size or color"}
      </button>

      {showAddForm && (
        <article>
          <h3>New size and color</h3>

          <VariantForm
            key={newFormKey}
            submitLabel="Add option"
            submitting={action === "create"}
            onSubmit={handleCreate}
          />
        </article>
      )}
    </section>
  );
}