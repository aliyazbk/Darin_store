import { useState } from "react";

import VariantForm from "./VariantForm";
import ErrorMessage from "../../ui/ErrorMessage";

import {
  createProductVariant,
  deactivateProductVariant,
  updateProductVariant,
} from "../../../services/adminProductService";

export default function VariantManager({
  productId,
  variants,
  onUpdated,
}) {
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newFormKey, setNewFormKey] = useState(0);

  function handleError(error) {
    console.error("Variant request failed:", error);

    const validationErrors =
      error.response?.data?.errors;

    if (validationErrors) {
      setError(
        Object.values(validationErrors)
          .flat()
          .join(" ")
      );
    } else {
      setError(
        error.response?.data?.message ??
          "Unable to save variant."
      );
    }
  }

  async function handleCreate(variantData) {
    try {
      setAction("create");
      setError("");
      setSuccess("");

      await createProductVariant(
        productId,
        variantData
      );

      setSuccess("Variant created successfully.");
      setNewFormKey((key) => key + 1);
      onUpdated();
    } catch (error) {
      handleError(error);
    } finally {
      setAction("");
    }
  }

  async function handleUpdate(
    variantId,
    variantData
  ) {
    try {
      setAction(`update-${variantId}`);
      setError("");
      setSuccess("");

      await updateProductVariant(
        productId,
        variantId,
        variantData
      );

      setSuccess("Variant updated successfully.");
      onUpdated();
    } catch (error) {
      handleError(error);
    } finally {
      setAction("");
    }
  }

  async function handleDeactivate(variantId) {
    const confirmed = window.confirm(
      "Deactivate this variant?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setAction(`delete-${variantId}`);
      setError("");
      setSuccess("");

      await deactivateProductVariant(
        productId,
        variantId
      );

      setSuccess("Variant deactivated successfully.");
      onUpdated();
    } catch (error) {
      handleError(error);
    } finally {
      setAction("");
    }
  }

  return (
    <section>
      <h2>Variants</h2>

      {success && <p role="status">{success}</p>}
      {error && <ErrorMessage message={error} />}

      {variants.map((variant) => (
        <article key={variant.id}>
          <h3>
            {variant.size} / {variant.color}
          </h3>

          <VariantForm
            initialVariant={variant}
            submitLabel="Update variant"
            submitting={
              action === `update-${variant.id}`
            }
            onSubmit={(variantData) =>
              handleUpdate(
                variant.id,
                variantData
              )
            }
          />

          <button
            type="button"
            disabled={
              action === `delete-${variant.id}`
            }
            onClick={() =>
              handleDeactivate(variant.id)
            }
          >
            Deactivate
          </button>
        </article>
      ))}

      <article>
        <h3>Add variant</h3>

        <VariantForm
          key={newFormKey}
          submitLabel="Add variant"
          submitting={action === "create"}
          onSubmit={handleCreate}
        />
      </article>
    </section>
  );
}