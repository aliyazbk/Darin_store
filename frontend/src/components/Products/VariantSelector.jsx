import "../../styles/components/VariantSelector.css";

function findSwatchImage(images, color) {
  const matches = images.filter((image) => image.color === color);

  if (matches.length === 0) {
    return null;
  }

  return matches.find((image) => image.is_primary) ?? matches[0];
}

export default function VariantSelector({
  variants,
  images = [],
  selectedVariant,
  onSelect,
}) {
  if (!variants || variants.length === 0) {
    return <p>This product is currently out of stock.</p>;
  }

  const colors = [
    ...new Set(variants.map((variant) => variant.color).filter(Boolean)),
  ];

  const selectedColor = selectedVariant?.color ?? colors[0];

  const colorVariants = variants.filter(
    (variant) => variant.color === selectedColor
  );

  function selectColor(color) {
    const sameSize = variants.find(
      (variant) =>
        variant.color === color && variant.size === selectedVariant?.size
    );

    const firstAvailable = variants.find(
      (variant) => variant.color === color
    );

    onSelect(sameSize ?? firstAvailable);
  }

  return (
    <div className="variant-selector">
      <fieldset>
        <legend>Color: {selectedColor}</legend>

        <div className="variant-selector__options variant-selector__options--colors">
          {colors.map((color) => {
            const isSelected = color === selectedColor;
            const swatchImage = findSwatchImage(images, color);

            return (
              <button
                key={color}
                type="button"
                className={
                  isSelected
                    ? "variant-selector__swatch selected"
                    : "variant-selector__swatch"
                }
                onClick={() => selectColor(color)}
                aria-pressed={isSelected}
                title={color}
              >
                <span className="variant-selector__swatch-thumb">
                  {swatchImage ? (
                    <img src={swatchImage.image_url} alt="" />
                  ) : (
                    <span className="variant-selector__swatch-fallback">
                      {color.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="variant-selector__swatch-label">
                  {color}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend>Size</legend>

        <div className="variant-selector__options">
          {colorVariants.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id;
            const isOutOfStock = variant.stock_quantity <= 0;

            return (
              <button
                key={variant.id}
                type="button"
                className={
                  isSelected
                    ? "variant-selector__button selected"
                    : "variant-selector__button"
                }
                disabled={isOutOfStock}
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
