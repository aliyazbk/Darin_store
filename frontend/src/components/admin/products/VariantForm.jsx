import {
  useEffect,
  useState,
} from "react";

const emptyVariant = {
  sku: "",
  size: "",
  color: "",
  stock_quantity: 0,
  price: "",
  is_active: true,
};

export default function VariantForm({
  initialVariant = null,
  submitLabel,
  submitting,
  onSubmit,
}) {
  const [variant, setVariant] =
    useState(emptyVariant);

  useEffect(() => {
    setVariant(
      initialVariant
        ? {
            sku: initialVariant.sku ?? "",
            size: initialVariant.size ?? "",
            color: initialVariant.color ?? "",

            stock_quantity:
              initialVariant.stock_quantity ?? 0,

            price:
              initialVariant.price ?? "",

            is_active:
              initialVariant.is_active ?? true,
          }
        : emptyVariant
    );
  }, [initialVariant]);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setVariant((current) => ({
      ...current,
      [name]: type === "checkbox"
        ? checked
        : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      sku: variant.sku.trim(),
      size: variant.size.trim(),
      color: variant.color.trim(),

      stock_quantity:
        Number(variant.stock_quantity),

      price:
        variant.price === ""
          ? null
          : Number(variant.price),

      is_active: variant.is_active,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        SKU
        <input
          name="sku"
          value={variant.sku}
          onChange={handleChange}
          required
        />
      </label>

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
        <input
          name="color"
          value={variant.color}
          onChange={handleChange}
          required
        />
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
        Custom price
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

      <button
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}