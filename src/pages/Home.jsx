import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import { categories } from "../data/products";
import { useProducts } from "../ProductsContext";
import "./Home.css";

const steps = [
  [
    "01",
    "Search simply",
    "Find pieces by item, category or the amount you want to spend.",
  ],
  [
    "02",
    "Compare clearly",
    "See prices, materials and availability without jumping between social feeds.",
  ],
  [
    "03",
    "Contact directly",
    "Call or WhatsApp the supplier to confirm details and arrange your purchase.",
  ],
];

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { products, loading, error } = useProducts();

  const featuredOnes = products.filter((p) => p.featured).slice(0, 4);
  const featured =
    featuredOnes.length > 0 ? featuredOnes : products.slice(0, 4);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <>
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">A better way to furnish your home</p>
          <h1>
            Discover your kind of <em>home.</em>
          </h1>
          <p className="hero-text">
            Browse furniture and décor from trusted local shops, suppliers and
            craftspeople, all in one considered catalogue.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              aria-label="Search products"
              placeholder="Try “olive sofa” or “woven basket”"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="hero-popular">
            <span>Popular:</span>
            <Link to="/products?q=sofa">Sofas</Link>
            <Link to="/products?q=rug">Rugs</Link>
            <Link to="/products?q=decor">Décor</Link>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="band-inner">
          <div className="band-header">
            <div>
              <p className="eyebrow eyebrow-dark">Start with a room in mind</p>
              <h2 className="section-title">
                Shop by <em>category.</em>
              </h2>
            </div>
            <Link className="text-link text-link-top" to="/products">
              Browse all →
            </Link>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                to={`/products?category=${cat.value}`}
                className="category-card"
              >
                <div className="category-image">
                  <ProductImage
                    file={cat.image}
                    alt={cat.label}
                    folder="categories"
                  />
                </div>
                <div className="category-label">
                  <div>
                    <h3>{cat.label}</h3>
                    <p>Explore collection</p>
                  </div>
                  <span className="category-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-sand">
        <div className="band-inner">
          <div className="band-header">
            <div>
              <p className="eyebrow eyebrow-dark">Featured</p>
              <h2 className="section-title">Hand-picked for your space</h2>
            </div>
            <Link className="text-link text-link-top" to="/products">
              View catalogue →
            </Link>
          </div>

          {loading ? (
            <p className="empty-note">Loading products…</p>
          ) : error ? (
            <p className="empty-note">{error}</p>
          ) : featured.length > 0 ? (
            <div className="product-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="empty-note">
              New products are being reviewed. Check back soon.
            </p>
          )}
        </div>
      </section>

      <section className="band band-sage">
        <div className="band-inner">
          <p className="eyebrow eyebrow-light">
            Less searching. Better choices.
          </p>
          <div className="steps-layout">
            <h2 className="steps-title">
              Your shortcut to a more personal home.
            </h2>
            <div className="steps-grid">
              {steps.map(([number, title, copy]) => (
                <div className="step" key={number}>
                  <span className="step-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="band band-rusk">
        <div className="band-inner cta-row">
          <div>
            <p className="eyebrow eyebrow-dark">Made or sold locally?</p>
            <h2 className="cta-title">
              Put your products in front of more homes.
            </h2>
          </div>
          <Link className="btn-solid-dark cta-button" to="/submit">
            Submit a product →
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
