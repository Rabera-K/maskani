import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/products";
import { useProducts } from "../ProductsContext";
import {
  formatPrice,
  availabilityLabels,
  toTelLink,
  whatsappLink,
  isVerified,
  checkLabels,
} from "../utils";
import "./ProductDetail.css";

function ProductDetail() {
  const { slug } = useParams();
  const { products, loading, error } = useProducts();
  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return (
      <div className="detail-missing">
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-missing">
        <p>{error}</p>
      </div>
    );
  }

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="detail-missing">
        <h1>Product not found</h1>
        <p>This listing may have been removed or the link is incorrect.</p>
        <Link to="/products" className="btn-solid-dark">
          Browse all products
        </Link>
      </div>
    );
  }

  const supplier = product.supplier;
  const category = categories.find((c) => c.value === product.category);
  const currentImage = product.images[activeImage] ?? product.images[0];

  const specs = [
    ["Availability", availabilityLabels[product.availability]],
    ["Dimensions", product.dimensions],
    ["Materials", product.materials],
    ["Colours", product.colours],
  ].filter(([, value]) => value);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const message = `Hi ${supplier.name}, I found "${product.name}" on Maskani. Is it still available, and can you confirm the price?`;
  const passedChecks = Object.entries(checkLabels).filter(
    ([key]) => supplier.checks[key],
  );

  return (
    <div className="detail">
      <nav className="breadcrumb">
        <Link to="/products">All products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>
          {category.label}
        </Link>
      </nav>

      <div className="detail-layout">
        <div className="gallery">
          <div className="gallery-main">
            <ProductImage
              key={currentImage}
              file={currentImage}
              alt={product.name}
            />
          </div>
          {product.images.length > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((file, index) => (
                <button
                  key={file}
                  className={`thumb ${index === activeImage ? "thumb-active" : ""}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                >
                  <ProductImage file={file} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="eyebrow eyebrow-dark">{category.label}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">
            {formatPrice(product.priceFrom, product.priceTo)}
          </p>
          {product.priceFrom == null && (
            <p className="detail-note">
              The supplier hasn't listed a price. Contact them to ask.
            </p>
          )}

          {isVerified(supplier) && (
            <div className="detail-badges">
              <span className="badge badge-verified">Verified supplier</span>
            </div>
          )}

          <p className="detail-description">{product.description}</p>

          <dl className="specs">
            {specs.map(([label, value]) => (
              <div className="spec-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="supplier-card">
            <p className="filter-label">Supplier</p>
            <h2>{supplier.name}</h2>
            <p className="supplier-location">{supplier.location}</p>
            <p className="supplier-summary">{supplier.summary}</p>
            {passedChecks.length > 0 && (
              <ul className="checks">
                {passedChecks.map(([key, label]) => (
                  <li key={key}>{label}</li>
                ))}
              </ul>
            )}

            <div className="contact-buttons">
              <a
                className="btn-solid-dark"
                href={whatsappLink(supplier.whatsapp, message)}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp supplier
              </a>
              <a className="btn-outline-dark" href={toTelLink(supplier.phone)}>
                Call {supplier.phone}
              </a>
            </div>
            <p className="detail-note">
              Always confirm the price and availability with the supplier before
              you visit or pay. Maskani doesn't handle payments or delivery.
            </p>
          </div>

          <div className="trust-box">
            <p>
              <strong>Every listing is checked</strong> by the Maskani team
              before it is published.
            </p>
            <p>
              <strong>Verified supplier</strong> means the supplier has also
              passed all three Maskani checks: phone number confirmed, premises
              visited, and customer reviews received.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>More in {category.label}</h2>
          <div className="related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;
