import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../ProductsContext";
import { useSaved } from "../useSaved";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { products, categories, loading } = useProducts();
  const { ids } = useSaved();
  const MAX_NAV = 4;
  const navCategories = categories.slice(0, MAX_NAV);
  const moreCategories = categories.slice(MAX_NAV);
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
            {navCategories.map((cat) => (
              <Link key={cat.value} to={`/products?category=${cat.value}`}>
                {cat.label}
              </Link>
            ))}
            {moreCategories.length > 0 && (
              <details className="nav-more">
                <summary>More</summary>
                <div className="nav-more-menu">
                  {moreCategories.map((cat) => (
                    <Link
                      key={cat.value}
                      to={`/products?category=${cat.value}`}
                      onClick={(e) =>
                        e.currentTarget
                          .closest("details")
                          .removeAttribute("open")
                      }
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </details>
            )}
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
