import "../../styles/components/VariantSelector.css";

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}) {
  if (!variants || variants.length === 0) {
    return (
      <p>This product is currently out of stock.</p>
    );
  }

  const colors = [
    ...new Set(
      variants
        .map((variant) => variant.color)
        .filter(Boolean)
    ),
  ];

  const selectedColor =
    selectedVariant?.color ?? colors[0];

  const colorVariants = variants.filter(
    (variant) => variant.color === selectedColor
  );

  function selectColor(color) {
    const sameSize = variants.find(
      (variant) =>
        variant.color === color &&
        variant.size === selectedVariant?.size
    );

    const firstAvailable = variants.find(
      (variant) => variant.color === color
    );

    onSelect(sameSize ?? firstAvailable);
  }

  return (
    <div className="variant-selector">
      <fieldset>
        <legend>Color</legend>

        <div className="variant-selector__options">
          {colors.map((color) => {
            const isSelected =
              color === selectedColor;

            return (
              <button
                key={color}
                type="button"
                className={
                  isSelected
                    ? "variant-selector__button selected"
                    : "variant-selector__button"
                }
                onClick={() => selectColor(color)}
                aria-pressed={isSelected}
              >
                {color}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend>Size</legend>

        <div className="variant-selector__options">
          {colorVariants.map((variant) => {
            const isSelected =
              selectedVariant?.id === variant.id;

            return (
              <button
                key={variant.id}
                type="button"
                className={
                  isSelected
                    ? "variant-selector__button selected"
                    : "variant-selector__button"
                }
                onClick={() => onSelect(variant)}
                aria-pressed={isSelected}
              >
                {variant.size}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}