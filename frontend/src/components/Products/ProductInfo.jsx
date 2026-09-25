import VariantSelector from "./VariantSelector";
import "../../styles/components/ProductInfo.css";

function ProductInfo({
  product,
  selectedVariant,
  onVariantSelect,
  onAddToCart,
}) {
  const displayedPrice =
    selectedVariant?.price ?? product.base_price;

  return (
    <section className="product-info">
      <p className="product-info__category">
        {product.category?.name}
      </p>

      <h1>{product.name}</h1>

      <div className="product-info__prices">
        <span>${displayedPrice}</span>

        {product.compare_at_price && (
          <span className="product-info__old-price">
            ${product.compare_at_price}
          </span>
        )}
      </div>

      <p>{product.description}</p>

      <VariantSelector
        variants={product.variants}
        selectedVariant={selectedVariant}
        onSelect={onVariantSelect}
      />

      {selectedVariant && (
        <p>
          {selectedVariant.stock_quantity} currently available
        </p>
      )}

      <button
        type="button"
        disabled={!selectedVariant}
        onClick={onAddToCart}
            >
              Add to cart
            </button>
     
    </section>
  );
}

export default ProductInfo;