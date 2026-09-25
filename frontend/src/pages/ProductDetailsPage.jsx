import { useEffect,useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./../styles/pages/ProductDetailPage.css";
//import useProduct from "../hooks/useProducts";
import useCart from "../hooks/useCart";
import useProduct from "../hooks/useProduct";
import ProductGallery from "../components/Products/ProductGallery";
import ProductInfo from "../components/Products/ProductInfo";
import LoadingMessage from "../components/ui/LoadingMessage";
import ErrorMessage from "../components/ui/ErrorMessage";

function ProductDetailsPage() {
  // All hooks must be called before conditional returns.
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] =
    useState(null);
    const visibleImages = useMemo(() => {
  const images = product?.images ?? [];

  if (!selectedVariant?.color) {
    return images;
  }

  const matchingImages = images.filter(
    (image) =>
      !image.color ||
      image.color === selectedVariant.color
  );

  return matchingImages.length > 0
    ? matchingImages
    : images;
}, [product, selectedVariant]);

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

    addItem(product, selectedVariant);
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
    <div className="product-details">
     <ProductGallery
  images={visibleImages}
  productName={product.name}
/>

      <ProductInfo
        product={product}
        selectedVariant={selectedVariant}
        onVariantSelect={setSelectedVariant}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default ProductDetailsPage;