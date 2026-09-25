const emptyVariant = {
  sku: "",
  size: "",
  color: "",
  stock_quantity: 0,
  price: "",
  is_active: true,
};

export function createEmptyVariant() {
  return { ...emptyVariant };
}

export default function VariantFields({
  variants,
  onChange,
}) {
  function updateVariant(index, field, value) {
    onChange(
      variants.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  }

  function addVariant() {
    onChange([
      ...variants,
      createEmptyVariant(),
    ]);
  }

  function removeVariant(index) {
    if (variants.length === 1) {
      return;
    }

    onChange(
      variants.filter(
        (_, variantIndex) => variantIndex !== index
      )
    );
  }

  return (
    <fieldset>
      <legend>Product variants</legend>

      {variants.map((variant, index) => (
        <div key={index}>
          <h3>Variant {index + 1}</h3>

          <label>
            SKU
            <input
              type="text"
              value={variant.sku}
              onChange={(event) =>
                updateVariant(
                  index,
                  "sku",
                  event.target.value
                )
              }
              required
            />
          </label>

          <label>
            Size
            <input
              type="text"
              value={variant.size}
              onChange={(event) =>
                updateVariant(
                  index,
                  "size",
                  event.target.value
                )
              }
              required
            />
          </label>

          <label>
            Color
            <input
              type="text"
              value={variant.color}
              onChange={(event) =>
                updateVariant(
                  index,
                  "color",
                  event.target.value
                )
              }
              required
            />
          </label>

          <label>
            Stock
            <input
              type="number"
              min="0"
              value={variant.stock_quantity}
              onChange={(event) =>
                updateVariant(
                  index,
                  "stock_quantity",
                  event.target.value
                )
              }
              required
            />
          </label>

          <label>
            Custom price
            <input
              type="number"
              min="0"
              step="0.01"
              value={variant.price}
              onChange={(event) =>
                updateVariant(
                  index,
                  "price",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={variant.is_active}
              onChange={(event) =>
                updateVariant(
                  index,
                  "is_active",
                  event.target.checked
                )
              }
            />
            Active
          </label>

          <button
            type="button"
            disabled={variants.length === 1}
            onClick={() => removeVariant(index)}
          >
            Remove variant
          </button>
        </div>
      ))}

      <button type="button" onClick={addVariant}>
        Add another variant
      </button>
    </fieldset>
  );
}