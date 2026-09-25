import {
  useEffect,
  useState,
} from "react";

import VariantFields, {
  createEmptyVariant,
} from "./VariantFields";

const emptyProduct = {
  category_id: "",
  name: "",
  description: "",
  base_price: "",
  compare_at_price: "",
  is_active: true,
  is_featured: false,
};

export default function ProductForm({
  categories,
  initialProduct = null,
  includeVariants = false,
  submitting = false,
  validationErrors = {},
  submitLabel = "Save product",
  onSubmit,
}) {
  const [product, setProduct] = useState(emptyProduct);
  const [variants, setVariants] = useState([
    createEmptyVariant(),
  ]);

  useEffect(() => {
    if (!initialProduct) {
      return;
    }

    setProduct({
      category_id:
        initialProduct.category_id ?? "",

      name:
        initialProduct.name ?? "",

      description:
        initialProduct.description ?? "",

      base_price:
        initialProduct.base_price ?? "",

      compare_at_price:
        initialProduct.compare_at_price ?? "",

      is_active:
        initialProduct.is_active ?? true,

      is_featured:
        initialProduct.is_featured ?? false,
    });
  }, [initialProduct]);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setProduct((currentProduct) => ({
      ...currentProduct,
      [name]: type === "checkbox"
        ? checked
        : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      category_id: Number(product.category_id),
      name: product.name.trim(),
      description:
        product.description.trim() || null,

      base_price:
        Number(product.base_price),

      compare_at_price:
        product.compare_at_price === ""
          ? null
          : Number(product.compare_at_price),

      is_active: product.is_active,
      is_featured: product.is_featured,
    };

    if (includeVariants) {
      payload.variants = variants.map(
        (variant) => ({
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
        })
      );
    }

    onSubmit(payload);
  }

  const errorMessages =
    Object.values(validationErrors).flat();

  return (
    <form
      className="admin-product-form"
      onSubmit={handleSubmit}
    >
      {errorMessages.length > 0 && (
        <div role="alert">
          <ul>
            {errorMessages.map((message, index) => (
              <li key={`${message}-${index}`}>
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset>
        <legend>Product information</legend>

        <label htmlFor="product-category">
          Category
        </label>

        <select
          id="product-category"
          name="category_id"
          value={product.category_id}
          onChange={handleChange}
          required
        >
          <option value="">
            Select a category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="product-name">
          Product name
        </label>

        <input
          id="product-name"
          name="name"
          type="text"
          value={product.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="product-description">
          Description
        </label>

        <textarea
          id="product-description"
          name="description"
          value={product.description}
          onChange={handleChange}
          rows="5"
        />

        <label htmlFor="product-base-price">
          Base price
        </label>

        <input
          id="product-base-price"
          name="base_price"
          type="number"
          min="0"
          step="0.01"
          value={product.base_price}
          onChange={handleChange}
          required
        />

        <label htmlFor="product-compare-price">
          Compare-at price
        </label>

        <input
          id="product-compare-price"
          name="compare_at_price"
          type="number"
          min="0"
          step="0.01"
          value={product.compare_at_price}
          onChange={handleChange}
        />

        <label>
          <input
            name="is_active"
            type="checkbox"
            checked={product.is_active}
            onChange={handleChange}
          />
          Active
        </label>

        <label>
          <input
            name="is_featured"
            type="checkbox"
            checked={product.is_featured}
            onChange={handleChange}
          />
          Featured
        </label>
      </fieldset>

      {includeVariants && (
        <VariantFields
          variants={variants}
          onChange={setVariants}
        />
      )}

      <button
        type="submit"
        disabled={submitting}
      >
        {submitting
          ? "Saving..."
          : submitLabel}
      </button>
    </form>
  );
}