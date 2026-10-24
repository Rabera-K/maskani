import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import {
  formatPrice,
  getSupplier,
  availabilityLabels,
  isVerified,
} from "../utils";
import "./ProductCard.css";

function ProductCard({ product }) {
  const supplier = getSupplier(product.supplierId);

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-card-image">
        <ProductImage file={product.images[0]} alt={product.name} />
        <div className="badges">
          {product.listingReviewed && (
            <span className="badge">Reviewed listing</span>
          )}
          {supplier && isVerified(supplier) && (
            <span className="badge badge-verified">Verified supplier</span>
          )}
        </div>
      </div>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p className="price">
          {formatPrice(product.priceFrom, product.priceTo)}
        </p>
        <p className="meta">
          {product.location} · {availabilityLabels[product.availability]}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
