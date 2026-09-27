import VariantSelector from "./VariantSelector";
import "../../styles/components/ProductInfo.css";
import {
  getFinalPrice,
  getOriginalPrice,
} from "../../utils/productPricing";

const LOW_STOCK_THRESHOLD = 5;

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

  const isLowStock =
    selectedVariant && selectedVariant.stock_quantity <= LOW_STOCK_THRESHOLD;

  function decreaseQuantity() {
    onQuantityChange(Math.max(1, quantity - 1));
  }

  function increaseQuantity() {
    onQuantityChange(
      Math.min(selectedVariant.stock_quantity, quantity + 1)
    );
  }

  return (
    <section className="product-info">
      <p className="product-info__category">{product.category?.name}</p>

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

      <VariantSelector
        variants={product.variants}
        images={product.images ?? []}
        selectedVariant={selectedVariant}
        onSelect={(variant) => {
          onVariantSelect(variant);
          onQuantityChange(1);
        }}
      />

      {selectedVariant && (
        <p
          className={
            isLowStock
              ? "product-info__stock product-info__stock--low"
              : "product-info__stock"
          }
        >
          {isLowStock
            ? `Only ${selectedVariant.stock_quantity} left in stock — order soon`
            : `${selectedVariant.stock_quantity} in stock`}
        </p>
      )}

      <div className="product-quantity">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={decreaseQuantity}
        >
          −
        </button>

        <span aria-live="polite">{quantity}</span>

        <button
          type="button"
          aria-label="Increase quantity"
          disabled={
            !selectedVariant || quantity >= selectedVariant.stock_quantity
          }
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>

      <button
        type="button"
        className="product-info__submit"
        disabled={!selectedVariant}
        onClick={onAddToCart}
      >
        Add to cart
      </button>

      <ul className="product-info__trust-badges">
        <li>
          <span aria-hidden="true">🚚</span> Fast delivery, Lebanon-wide
        </li>
        <li>
          <span aria-hidden="true">💵</span> Cash on delivery available
        </li>
        <li>
          <span aria-hidden="true">↺</span> Easy exchanges
        </li>
      </ul>

      <div className="product-info__accordion">
        <details open>
          <summary>Description</summary>
          <p>{product.description}</p>
        </details>

        <details>
          <summary>Delivery &amp; returns</summary>
          <p>
            Add your shipping timelines, cash-on-delivery coverage, and
            exchange policy here so customers know what to expect before
            they order.
          </p>
        </details>

        <details>
          <summary>Care instructions</summary>
          <p>
            Add fabric-specific care notes here (wash, dry, iron
            guidance) so customers can keep the item looking its best.
          </p>
        </details>
      </div>

      {/* Mobile-only sticky bar so the CTA stays reachable on long pages. */}
      <div className="product-mobile-cta">
        <div className="product-mobile-cta__price">
          <span>${displayedPrice.toFixed(2)}</span>
          {isOnSale && (
            <span className="product-info__old-price">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!selectedVariant}
          onClick={onAddToCart}
        >
          Add to cart
        </button>
      </div>
    </section>
  );
}

export default ProductInfo;
