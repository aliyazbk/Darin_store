import {
  Link,
  useParams,
} from "react-router-dom";

import ProductInformationSection from "../../components/admin/products/ProductInformationSection";
import LoadingMessage from "../../components/ui/LoadingMessage";
import ErrorMessage from "../../components/ui/ErrorMessage";

import useAdminProduct from "../../hooks/useAdminProduct";
import useAdminCategories from "../../hooks/useAdminCategories";
import VariantManager from "../../components/admin/products/VariantManager";
import ImageManager from "../../components/admin/products/ImageManager";

export default function AdminManageProductPage() {
  const { productId } = useParams();

  const {
    product,
    loading: productLoading,
    error: productError,
    refresh,
  } = useAdminProduct(productId);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAdminCategories();

  if (productLoading || categoriesLoading) {
    return (
      <LoadingMessage message="Loading product..." />
    );
  }

  if (productError || categoriesError) {
    return (
      <ErrorMessage
        message={productError || categoriesError}
      />
    );
  }

  if (!product) {
    return (
      <ErrorMessage message="Product not found." />
    );
  }
  const productColors = [
  ...new Set(
    (product.variants ?? [])
      .map((variant) => variant.color)
      .filter(Boolean)
  ),
];

  return (
    <main className="admin-manage-product-page">
      <header>
        <Link to="/admin/products">
          Back to products
        </Link>

        <h1>{product.name}</h1>

        <a
          href={`/products/${product.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          View in store
        </a>
      </header>

      <ProductInformationSection
        product={product}
        categories={categories}
        onUpdated={refresh}
      />

     <VariantManager
        productId={product.id}
        variants={product.variants ?? []}
        onUpdated={refresh}
      />
      <ImageManager
         productId={product.id}
         images={product.images ?? []}
         colors={productColors}
         onUpdated={refresh}
      />
    </main>
  );
}