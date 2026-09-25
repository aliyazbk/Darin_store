import { Link } from "react-router-dom";
import "../../styles/components/ProductCard.css";
function ProductCard({ product }) {
  const primaryImage =
    product.images?.find((image) => image.is_primary) ??
    product.images?.[0];

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`}>
        <div className="product-card__image-container">
          {primaryImage?.image_url ? (
            <img
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              className="product-card__image"
              loading="lazy"
            />
          ) : (
            <div className="product-card__placeholder">
              No image available
            </div>
          )}
        </div>

        <div className="product-card__information">
          <p className="product-card__category">
            {product.category?.name}
          </p>

          <h2 className="product-card__name">
            {product.name}
          </h2>

          <div className="product-card__prices">
            <span className="product-card__price">
              ${Number(product.base_price).toFixed(2)}
            </span>

            {product.compare_at_price && (
              <span className="product-card__old-price">
                ${Number(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;