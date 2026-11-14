import { Link } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import { useProducts } from "../ProductsContext";

function Categories() {
  const { categories, loading } = useProducts();

  return (
    <section className="band">
      <div className="band-inner">
        <h1 className="section-title">All categories</h1>
        {loading ? (
          <p>Loading…</p>
        ) : (
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
        )}
      </div>
    </section>
  );
}

export default Categories;
