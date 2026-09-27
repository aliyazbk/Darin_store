import ProductGrid from "./ProductGrid";
import useRelatedProducts from "../../hooks/useRelatedProducts";
import "../../styles/components/RelatedProducts.css";

export default function RelatedProducts({ product }) {
  const { products, loading } = useRelatedProducts(product);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="related-products">
      <h2>You may also like</h2>
      <ProductGrid products={products} />
    </section>
  );
}
