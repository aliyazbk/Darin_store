import {
  useEffect,
  useState,
} from "react";

import "../../styles/components/ProductGallery.css";

export default function ProductGallery({
  images = [],
  productName,
}) {
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="product-gallery__placeholder">
        No product images available
      </div>
    );
  }

  const selectedImage =
    images[selectedIndex] ?? images[0];

  function showPrevious() {
    setSelectedIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  }

  function showNext() {
    setSelectedIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  }

  return (
    <section
      className="product-gallery"
      aria-label={`${productName} images`}
    >
      <div className="product-gallery__main">
        <img
          src={selectedImage.image_url}
          alt={
            selectedImage.alt_text ||
            productName
          }
          className="product-gallery__main-image"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="product-gallery__arrow product-gallery__arrow--previous"
              onClick={showPrevious}
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              type="button"
              className="product-gallery__arrow product-gallery__arrow--next"
              onClick={showNext}
              aria-label="Next image"
            >
              ›
            </button>

            <span className="product-gallery__counter">
              {selectedIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="product-gallery__thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={
                index === selectedIndex
                  ? "product-gallery__thumbnail selected"
                  : "product-gallery__thumbnail"
              }
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show image ${index + 1}`}
            >
              <img
                src={image.image_url}
                alt=""
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}