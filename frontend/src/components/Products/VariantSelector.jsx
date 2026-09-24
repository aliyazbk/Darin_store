function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}) {
  if (!variants || variants.length === 0) {
    return <p>This product is currently out of stock.</p>;
  }

  return (
    <fieldset className="variant-selector">
      <legend>Select size and color</legend>

      <div className="variant-selector__options">
        {variants.map((variant) => {
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
              {variant.size} / {variant.color}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default VariantSelector;