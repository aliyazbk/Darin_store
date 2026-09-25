import { useState } from "react";

import ImageUploadForm from "./ImageUploadForm";
import ErrorMessage from "../../ui/ErrorMessage";

import {
  deleteProductImage,
  setPrimaryProductImage,
  uploadProductImage,
} from "../../../services/adminProductService";

export default function ImageManager({
  productId,
  images,
  colors,
  onUpdated,
}) {
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadKey, setUploadKey] = useState(0);

  function handleError(error) {
    console.error("Image request failed:", error);

    const validationErrors =
      error.response?.data?.errors;

    setError(
      validationErrors
        ? Object.values(validationErrors)
            .flat()
            .join(" ")
        : error.response?.data?.message ??
            "Unable to manage product image."
    );
  }

  async function handleUpload(imageData) {
    try {
      setAction("upload");
      setError("");
      setSuccess("");

      await uploadProductImage(
        productId,
        imageData
      );

      setSuccess("Image uploaded successfully.");
      setUploadKey((key) => key + 1);
      onUpdated();
    } catch (error) {
      handleError(error);
    } finally {
      setAction("");
    }
  }

  async function handleSetPrimary(imageId) {
    try {
      setAction(`primary-${imageId}`);
      setError("");
      setSuccess("");

      await setPrimaryProductImage(
        productId,
        imageId
      );

      setSuccess("Primary image updated.");
      onUpdated();
    } catch (error) {
      handleError(error);
    } finally {
      setAction("");
    }
  }

  async function handleDelete(imageId) {
    const confirmed = window.confirm(
      "Delete this product image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setAction(`delete-${imageId}`);
      setError("");
      setSuccess("");

      await deleteProductImage(
        productId,
        imageId
      );

      setSuccess("Image deleted successfully.");
      onUpdated();
    } catch (error) {
      handleError(error);
    } finally {
      setAction("");
    }
  }

  return (
    <section>
      <h2>Images</h2>

      {success && <p role="status">{success}</p>}
      {error && <ErrorMessage message={error} />}

      {images.length === 0 && (
        <p>No images uploaded.</p>
      )}

      <div>
        {images.map((image) => (
          <article key={image.id}>
            <img
              src={image.image_url}
              alt={image.alt_text || "Product"}
              width="160"
            />

            <p>
              {image.is_primary
                ? "Primary image"
                : `Display order: ${image.display_order}`}
            </p>

            {!image.is_primary && (
              <button
                type="button"
                disabled={
                  action === `primary-${image.id}`
                }
                onClick={() =>
                  handleSetPrimary(image.id)
                }
              >
                Set as primary
              </button>
            )}

            <button
              type="button"
              disabled={
                action === `delete-${image.id}`
              }
              onClick={() =>
                handleDelete(image.id)
              }
            >
              Delete image
            </button>
          </article>
        ))}
      </div>

      <h3>Upload image</h3>

    <ImageUploadForm
  key={uploadKey}
  colors={colors}
  submitting={action === "upload"}
  onSubmit={handleUpload}
/>
    </section>
  );
}