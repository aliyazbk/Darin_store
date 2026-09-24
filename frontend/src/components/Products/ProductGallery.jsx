function ProductGallery({ images, productName }) {
  if (!images || images.length === 0) {
    return (
      <div className="product-gallery__placeholder">
        <p>No product images available</p>
      </div>
    );
  }

  return (
    <section
      className="product-gallery"
      aria-label={`${productName} images`}
    >
      {images.map((image) => (
        <div
          className="product-gallery__placeholder"
          key={image.id}
        >
          <p>{image.alt_text || productName}</p>
        </div>
      ))}
    </section>
  );
}

export default ProductGallery;