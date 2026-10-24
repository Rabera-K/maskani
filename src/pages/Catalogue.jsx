import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";
import "./Catalogue.css";

function matchesSearch(product, query) {
  if (!query) return true;
  const categoryLabel = categories.find(
    (c) => c.value === product.category,
  )?.label;
  const text = [
    product.name,
    product.description,
    product.materials,
    product.colours,
    categoryLabel,
  ]
    .join(" ")
    .toLowerCase();

  // every word the user typed must appear somewhere in the product text
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}

function matchesBudget(product, min, max) {
  if (min == null && max == null) return true;

  // unknown price can never count as "within budget"
  if (product.priceFrom == null) return false;

  const low = product.priceFrom;
  const high = product.priceTo ?? product.priceFrom;

  if (max != null && low > max) return false;
  if (min != null && high < min) return false;
  return true;
}

function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minRaw = searchParams.get("min") || "";
  const maxRaw = searchParams.get("max") || "";
  const sort = searchParams.get("sort") || "";

  const min = minRaw === "" ? null : Number(minRaw);
  const max = maxRaw === "" ? null : Number(maxRaw);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function clearFilters() {
    setSearchParams({});
  }

  let results = products.filter(
    (p) =>
      (!category || p.category === category) &&
      matchesSearch(p, q) &&
      matchesBudget(p, min, max),
  );

  if (sort === "price-asc") {
    results.sort((a, b) =>
      (a.priceFrom ?? Infinity) < (b.priceFrom ?? Infinity) ? -1 : 1,
    );
  } else if (sort === "price-desc") {
    results.sort((a, b) =>
      (a.priceFrom ?? -Infinity) > (b.priceFrom ?? -Infinity) ? -1 : 1,
    );
  }

  const activeCategory = categories.find((c) => c.value === category);
  const budgetActive = min != null || max != null;
  const anyFilter = q || category || budgetActive;

  return (
    <div className="catalogue">
      <header className="catalogue-header">
        <h1>{activeCategory ? activeCategory.label : "All products"}</h1>
        {q && (
          <p className="catalogue-sub">
            Every listing is checked by the Maskani team before it is published.
          </p>
        )}
      </header>

      <button
        className="filters-toggle"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide filters" : "Show filters"}
      </button>

      <div className="catalogue-layout">
        <aside className={`filters ${showFilters ? "filters-open" : ""}`}>
          <div className="filter-group">
            <label className="filter-label" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              type="text"
              className="filter-input"
              placeholder="Sofa, rug, basket…"
              value={q}
              onChange={(e) => updateParam("q", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <p className="filter-label">Category</p>
            <button
              className={`filter-option ${!category ? "active" : ""}`}
              onClick={() => updateParam("category", "")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.value}
                className={`filter-option ${category === c.value ? "active" : ""}`}
                onClick={() => updateParam("category", c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <p className="filter-label">Budget (KES)</p>
            <div className="budget-row">
              <input
                type="number"
                min="0"
                className="filter-input"
                placeholder="Min"
                aria-label="Minimum price"
                value={minRaw}
                onChange={(e) => updateParam("min", e.target.value)}
              />
              <span>–</span>
              <input
                type="number"
                min="0"
                className="filter-input"
                placeholder="Max"
                aria-label="Maximum price"
                value={maxRaw}
                onChange={(e) => updateParam("max", e.target.value)}
              />
            </div>
            {budgetActive && (
              <p className="filter-note">
                Products with “price on request” are hidden while a budget is
                set.
              </p>
            )}
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="sort">
              Sort by
            </label>
            <select
              id="sort"
              className="filter-input"
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
            >
              <option value="">Default</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>

          {anyFilter && (
            <button className="clear-btn" onClick={clearFilters}>
              Clear all filters
            </button>
          )}
        </aside>

        <section>
          <p className="result-count">
            Showing {results.length} of {products.length} products
          </p>

          {results.length > 0 ? (
            <div className="catalogue-grid">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No matches found</h2>
              <p>
                Try a different keyword, widen your budget, or clear the
                filters.
              </p>
              <button className="clear-btn" onClick={clearFilters}>
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Catalogue;
