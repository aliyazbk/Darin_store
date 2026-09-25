import { useState } from "react";

export default function ImageUploadForm({
  colors,
  submitting,
  onSubmit,
}) {
  const [image, setImage] = useState(null);
  const [altText, setAltText] = useState("");
  const [color, setColor] = useState("");
  const [isPrimary, setIsPrimary] =
    useState(false);

  const [displayOrder, setDisplayOrder] =
    useState(0);

  function handleSubmit(event) {
    event.preventDefault();

    if (!image) {
      return;
    }

    onSubmit({
      image,
      altText,
      color: color || null,
      isPrimary,
      displayOrder,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Image
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) =>
            setImage(event.target.files?.[0] ?? null)
          }
          required
        />
      </label>

      <label>
        Image color
        <select
          value={color}
          onChange={(event) =>
            setColor(event.target.value)
          }
        >
          <option value="">
            General product image
          </option>

          {colors.map((availableColor) => (
            <option
              key={availableColor}
              value={availableColor}
            >
              {availableColor}
            </option>
          ))}
        </select>
      </label>

      <label>
        Alternative text
        <input
          type="text"
          value={altText}
          onChange={(event) =>
            setAltText(event.target.value)
          }
        />
      </label>

      <label>
        Display order
        <input
          type="number"
          min="0"
          value={displayOrder}
          onChange={(event) =>
            setDisplayOrder(
              Number(event.target.value)
            )
          }
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={isPrimary}
          onChange={(event) =>
            setIsPrimary(event.target.checked)
          }
        />
        Set as primary image
      </label>

      <button
        type="submit"
        disabled={submitting || !image}
      >
        {submitting
          ? "Uploading..."
          : "Upload image"}
      </button>
    </form>
  );
}