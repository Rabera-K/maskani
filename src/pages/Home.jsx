import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
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
            placeholder="Try “olive sofa under 70,000”"
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
  );
}

export default Home;
