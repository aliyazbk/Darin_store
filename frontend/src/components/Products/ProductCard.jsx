import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const primaryImage =
    product.images?.find((image) => image.is_primary) ??
    product.images?.[0];

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`}>
        <div className="product-card__image-container">
          {primaryImage ? (
            <p>Product image coming soon</p>
          ) : (
            <p>No image available</p>
          )}
        </div>

        <div className="product-card__information">
          <p className="product-card__category">
            {product.category?.name}
          </p>

          <h2 className="product-card__name">{product.name}</h2>

          <div className="product-card__prices">
            <span className="product-card__price">
              ${product.base_price}
            </span>

            {product.compare_at_price && (
              <span className="product-card__old-price">
                ${product.compare_at_price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;