import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductGrid from "../components/Products/ProductGrid";
import {
  getHomeCatalog,
  getStoreSettings,
} from "../services/storefrontService";
import LoadingMessage from "../components/ui/LoadingMessage";
import ErrorMessage from "../components/ui/ErrorMessage";
import "../styles/pages/HomePage.css";

function ProductSection({ title, products, link }) {
  if (!products?.length) return null;

  return (
    <section className="home-products">
      <div className="home-section-heading">
        <h2>{title}</h2>
        {link && <Link to={link}>View all →</Link>}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}

export default function HomePage() {
  const [catalog, setCatalog] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getHomeCatalog(), getStoreSettings()])
      .then(([homeCatalog, storeSettings]) => {
        setCatalog(homeCatalog);
        setSettings(storeSettings);
      })
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ??
            "Unable to load the homepage."
        );
      });
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (!catalog) return <LoadingMessage message="Loading store..." />;

  return (
    <div className="home-page">
      <section className="home-hero">
        {settings?.hero_video_url ? (
          <video
            className="home-hero-video"
            src={settings.hero_video_url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : (
          <div className="home-hero-fallback" />
        )}

        <div className="home-hero-shade" />

        <div className="home-hero-content">
          <p>New season</p>
          <h1>{settings?.hero_title || "Darin Clothet"}</h1>
          {settings?.hero_subtitle && <p>{settings.hero_subtitle}</p>}
          <Link to={settings?.hero_button_url || "/products"}>
            {settings?.hero_button_text || "Shop now"}
          </Link>
        </div>
      </section>
          {(catalog.sections ?? []).some(
  (section) => section.category?.slug && section.products?.length
) && (
  <section className="home-collections">
    <div className="home-section-heading">
      <h2>Shop by <em>collection</em></h2>
      <Link to="/products">Explore all</Link>
    </div>

    <div className="home-collections__grid">
      {(catalog.sections ?? [])
        .filter(
          (section) =>
            section.category?.slug && section.products?.length
        )
        .slice(0, 4)
        .map((section) => {
          const images = section.products[0]?.images ?? [];
          const image =
            images.find((item) => item.is_primary) ?? images[0];

          return (
            <Link
              key={section.id}
              className="home-collection"
              to={`/products?category=${encodeURIComponent(
                section.category.slug
              )}`}
            >
              <div className="home-collection__image">
                {image?.image_url && (
                  <img
                    src={image.image_url}
                    alt=""
                    loading="lazy"
                  />
                )}
              </div>
              <h3>{section.title}</h3>
            </Link>
          );
        })}
    </div>
   </section>
    )}
      <ProductSection
        title="On Sale"
        products={catalog.on_sale}
        link="/products"
      />

      <ProductSection
        title="Top Buying"
        products={catalog.best_sellers}
        link="/products"
      />

      {(catalog.sections ?? []).map((section) => (
        <ProductSection
          key={section.id}
          title={section.title}
          products={section.products}
          link={`/products?category=${encodeURIComponent(
            section.category.slug
          )}`}
        />
      ))}

      <ProductSection
        title="All Products"
        products={catalog.newest}
        link="/products"
      />
    </div>
  );
}