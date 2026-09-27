import { useState } from "react";

import { PRODUCT_COLORS } from "../../../constants/productColors";

export default function VariantForm({
  initialVariant = null,
  submitLabel = "Save option",
  submitting = false,
  onSubmit,
}) {
  const [variant, setVariant] = useState({
    size: initialVariant?.size ?? "",
    color: initialVariant?.color ?? "",
    stock_quantity: initialVariant?.stock_quantity ?? 0,
    price: initialVariant?.price ?? "",
    is_active: initialVariant?.is_active ?? true,
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setVariant((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      // Keep the SKU for an existing variant.
      // Generate one only when creating a new variant.
      sku: initialVariant?.sku ?? `DAR-${crypto.randomUUID()}`,
      size: variant.size.trim(),
      color: variant.color.trim(),
      stock_quantity: Number(variant.stock_quantity),
      price: variant.price === "" ? null : Number(variant.price),
      is_active: variant.is_active,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Size
        <input
          name="size"
          value={variant.size}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Color
        <select
          name="color"
          value={variant.color}
          onChange={handleChange}
          required
        >
          <option value="">Select a color</option>

          {PRODUCT_COLORS.map((colorOption) => (
            <option key={colorOption} value={colorOption}>
              {colorOption}
            </option>
          ))}
        </select>
      </label>

      <label>
        Stock
        <input
          name="stock_quantity"
          type="number"
          min="0"
          value={variant.stock_quantity}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Custom price (optional)
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={variant.price}
          onChange={handleChange}
        />
      </label>

      <label>
        <input
          name="is_active"
          type="checkbox"
          checked={variant.is_active}
          onChange={handleChange}
        />
        Active
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}