import { useState } from "react";

// Used when a color already has variants but no swatch photo yet.
// The color is fixed (passed in), so this is just a file picker —
// no need to make the admin re-select the color from a dropdown.
export default function QuickColorImageUpload({
  color,
  submitting,
  onSubmit,
}) {
  const [image, setImage] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();

    if (!image) {
      return;
    }

    onSubmit({
      image,
      altText: null,
      color,
      isPrimary: false,
      displayOrder: 0,
    });

    setImage(null);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Photo for {color}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) =>
            setImage(event.target.files?.[0] ?? null)
          }
          required
        />
      </label>

      <button type="submit" disabled={submitting || !image}>
        {submitting ? "Uploading..." : "Add photo"}
      </button>
    </form>
  );
}
