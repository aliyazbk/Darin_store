import useProducts from "../hooks/useProducts";
import ProductGrid from "../components/Products/ProductGrid";
import LoadingMessage from "../components/ui/LoadingMessage";
import ErrorMessage from "../components/ui/ErrorMessage";
import EmptyMessage from "../components/ui/EmptyMessage";
import "../styles/pages/ProductPage.css";
function ProductsPage() {
  const {
    products,
    loading,
    error,
  } = useProducts();

  if (loading) {
    return <LoadingMessage message="Loading products..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (products.length === 0) {
    return (
      <EmptyMessage message="No products are currently available." />
    );
  }

  return (
    <section className="products-page">
      <header className="products-page__header">
        <p>Discover our collection</p>
        <h1>Our Products</h1>
      </header>

      <ProductGrid products={products} />
    </section>
  );
}

export default ProductsPage;