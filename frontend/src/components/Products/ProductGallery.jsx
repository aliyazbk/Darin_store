import {
  useEffect,
  useRef,
  useState,
} from "react";

import "../../styles/components/ProductGallery.css";

// Minimum horizontal finger movement (in pixels) before a touch
// gesture counts as an intentional swipe rather than a light tap
// or an accidental wobble.
const SWIPE_THRESHOLD = 40;

export default function ProductGallery({
  images = [],
  jumpToIndex,
  productName,
}) {
  const [selectedIndex, setSelectedIndex] =
    useState(jumpToIndex ?? 0);
  const touchStartX = useRef(null);

  // Only snap to a new photo when the requested index actually
  // changes (i.e. a different color was picked) — this never
  // fires just because the user swiped or clicked a thumbnail.
  useEffect(() => {
    if (
      typeof jumpToIndex === "number" &&
      jumpToIndex >= 0 &&
      jumpToIndex < images.length
    ) {
      setSelectedIndex(jumpToIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpToIndex]);

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

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) {
      return;
    }

    const deltaX =
      event.changedTouches[0].clientX -
      touchStartX.current;

    touchStartX.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      return;
    }

    if (deltaX < 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  return (
    <section
      className="product-gallery"
      aria-label={`${productName} images`}
    >
      <div
        className="product-gallery__main"
        onTouchStart={
          images.length > 1 ? handleTouchStart : undefined
        }
        onTouchEnd={
          images.length > 1 ? handleTouchEnd : undefined
        }
      >
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
