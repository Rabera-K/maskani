import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Link to="/" className="footer-logo">
            Maskani<span>.</span>
          </Link>
          <p className="footer-text">
            A simpler way to discover furniture and décor from local Kenyan
            suppliers, shops and craftspeople.
          </p>
        </div>

        <div className="footer-links">
          <p className="footer-heading">Explore</p>
          <Link to="/products">All products</Link>
          <Link to="/products?category=sofas-seating">Sofas &amp; Seating</Link>
          <Link to="/products?category=rugs-mats">Rugs &amp; Mats</Link>
          <Link to="/products?category=decor-accessories">
            Décor &amp; Accessories
          </Link>
        </div>

        <div className="footer-links">
          <p className="footer-heading">For suppliers</p>
          <Link to="/submit">Submit a product</Link>
          <p className="footer-note">
            Every submission is reviewed by the Maskani team before it appears
            in the catalogue.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Maskani</span>
        <span>Made for homes across Kenya</span>
      </div>
    </footer>
  );
}

export default Footer;
