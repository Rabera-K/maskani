import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import SaveButton from "./SaveButton";
import { formatPrice, availabilityLabels, isVerified } from "../utils";
import "./ProductCard.css";

function ProductCard({ product }) {
  const supplier = product.supplier;

  return (
    <div className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card-link">
        <div className="product-card-image">
          <ProductImage file={product.images[0]} alt={product.name} />
          <div className="badges">
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
      <SaveButton productId={product.id} name={product.name} />
    </div>
  );
}

export default ProductCard;
