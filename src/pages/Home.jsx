import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }
  const featured = products.filter((p) => p.featured).slice(0, 4);
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
      <section className="section">
        <p className="eyebrow eyebrow-dark">Browse by category</p>
        <h2 className="section-title">Start with what you need</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="category-card"
            >
              <span>{cat.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow eyebrow-dark">Featured</p>
        <h2 className="section-title">Recently added pieces</h2>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link to="/products" className="text-link">
          View all products →
        </Link>
      </section>
    </>
  );
}

export default Home;
