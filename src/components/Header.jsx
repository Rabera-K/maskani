import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../ProductsContext";
import { useSaved } from "../useSaved";
import "./Header.css";

const categories = [
  { label: "Sofas & Seating", value: "sofas-seating" },
  { label: "Rugs & Mats", value: "rugs-mats" },
  { label: "Décor & Accessories", value: "decor-accessories" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { products, loading } = useProducts();
  const { ids } = useSaved();
  const savedCount = loading
    ? ids.length
    : products.filter((p) => ids.includes(p.id)).length;

  return (
    <>
      <div className="announcement">
        Discover interiors from local Kenyan suppliers
      </div>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            Maskani<span>.</span>
          </Link>

          <nav className="nav-desktop">
            {categories.map((cat) => (
              <Link key={cat.value} to={`/products?category=${cat.value}`}>
                {cat.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link
              to="/saved"
              className="saved-link"
              aria-label={`Enquiry list, ${savedCount} saved`}
            >
              Saved
              <span className="saved-count">{savedCount}</span>
            </Link>
            <Link to="/submit" className="btn-outline">
              List your product
            </Link>
            <button
              className="menu-toggle"
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="nav-mobile">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                to={`/products?category=${cat.value}`}
                onClick={() => setMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <Link
              to="/submit"
              className="btn-solid"
              onClick={() => setMenuOpen(false)}
            >
              List your product
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}

export default Header;
