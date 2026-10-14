import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./../styles/pages/ProductDetailPage.css";
import useCart from "../hooks/useCart";
import useProduct from "../hooks/useProduct";
import ProductGallery from "../components/Products/ProductGallery";
import ProductInfo from "../components/Products/ProductInfo";
import RelatedProducts from "../components/Products/RelatedProducts";
import LoadingMessage from "../components/ui/LoadingMessage";
import ErrorMessage from "../components/ui/ErrorMessage";

// Finds which image in the full gallery represents a given color,
// preferring the one marked primary (same rule VariantSelector uses
// for its swatch photos), so the gallery jumps to the same photo
// the swatch itself is showing.
function findColorImageIndex(images, color) {
  const candidates = images
    .map((image, index) => ({ image, index }))
    .filter(({ image }) => image.color === color);

  if (candidates.length === 0) {
    return -1;
  }

  const primary = candidates.find(
    ({ image }) => image.is_primary
  );

  return (primary ?? candidates[0]).index;
}

function ProductDetailsPage() {
  // All hooks must be called before conditional returns.
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const { addItem } = useCart();
const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const images = product?.images ?? [];

  // The gallery always shows every photo (every color, every
  // angle) in the thumbnail strip. Selecting a color only moves
  // the main photo to that color's picture — it never hides the
  // other thumbnails.
  const activeImageIndex = useMemo(() => {
    if (!selectedVariant?.color) {
      return 0;
    }

    const index = findColorImageIndex(
      images,
      selectedVariant.color
    );

    return index === -1 ? 0 : index;
  }, [images, selectedVariant]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  function handleAddToCart() {
    if (!product || !selectedVariant) {
      return;
    }

addItem(product, selectedVariant, quantity);
 }

  // Conditional returns come after every hook.
  if (loading) {
    return <LoadingMessage message="Loading product..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!product) {
    return <ErrorMessage message="Product not found." />;
  }

  return (
    <div className="product-details-page">
      <div className="product-details">
        <ProductGallery
          images={images}
          jumpToIndex={activeImageIndex}
          productName={product.name}
        />

        <ProductInfo
          product={product}
          selectedVariant={selectedVariant}
          onVariantSelect={setSelectedVariant}
          onAddToCart={handleAddToCart}
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      </div>

      <RelatedProducts product={product} />
    </div>
  );
}

export default ProductDetailsPage;
