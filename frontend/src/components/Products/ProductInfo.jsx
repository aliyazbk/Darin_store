import VariantSelector from "./VariantSelector";
import "../../styles/components/ProductInfo.css";
import {
  getFinalPrice,
  getOriginalPrice,
} from "../../utils/productPricing";
function ProductInfo({
  product,
  selectedVariant,
  onVariantSelect,
  onAddToCart,
  quantity,
  onQuantityChange,
}) {
 const originalPrice = getOriginalPrice(product, selectedVariant);
const displayedPrice = getFinalPrice(product, selectedVariant);
const isOnSale = Number(product.sale_percentage) > 0;

  return (
    <section className="product-info">
      <p className="product-info__category">
        {product.category?.name}
      </p>

      <h1>{product.name}</h1>

         <div className="product-info__prices">
        <span>${displayedPrice.toFixed(2)}</span>
        
        {isOnSale && (
          <>
            <span className="product-info__old-price">
              ${originalPrice.toFixed(2)}
            </span>
            <span>{product.sale_percentage}% OFF</span>
          </>
        )}
      </div>

      <p>{product.description}</p>

      <VariantSelector
        variants={product.variants}
        selectedVariant={selectedVariant}
        onSelect={(variant) => {
          onVariantSelect(variant);
          onQuantityChange(1);
        }}
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
            <div className="product-quantity">
  <button
    type="button"
    aria-label="Decrease quantity"
    disabled={quantity <= 1}
    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
  >
    −
  </button>

  <span aria-live="polite">{quantity}</span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={
          !selectedVariant ||
          quantity >= selectedVariant.stock_quantity
        }
        onClick={() =>
          onQuantityChange(
            Math.min(
              selectedVariant.stock_quantity,
              quantity + 1
            )
          )
        }
      >
        +
      </button>
</div>
     
    </section>
  );
}

export default ProductInfo;