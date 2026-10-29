import { Link } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import { useProducts } from "../ProductsContext";
import { useSaved } from "../useSaved";
import { formatPrice, toTelLink, whatsappLink } from "../utils";
import "./Saved.css";

function buildMessage(supplier, items) {
  const lines = items.map(
    (p, i) =>
      `${i + 1}. ${p.name} (${formatPrice(p.priceFrom, p.priceTo)}) ${window.location.origin}/products/${p.slug}`,
  );
  return `Hi ${supplier.name}, I found these on Maskani and would like to ask about them:\n\n${lines.join("\n")}\n\nCould you confirm availability and prices?`;
}

function Saved() {
  const { products, loading, error } = useProducts();
  const { ids, remove, clear } = useSaved();

  if (loading) {
    return (
      <div className="saved">
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved">
        <p className="field-error">{error}</p>
      </div>
    );
  }

  const saved = products.filter((p) => ids.includes(p.id));
  const missing = ids.length - saved.length;

  const groups = [];
  for (const product of saved) {
    let group = groups.find((g) => g.supplier.id === product.supplier.id);
    if (!group) {
      group = { supplier: product.supplier, items: [] };
      groups.push(group);
    }
    group.items.push(product);
  }

  return (
    <div className="saved">
      <h1>Your enquiry list</h1>

      {saved.length === 0 ? (
        <div className="saved-empty">
          <p>
            Tap the heart on any product to keep it here, then contact the
            supplier about everything at once.
          </p>
          <Link to="/products" className="btn-solid-dark saved-browse">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <p className="saved-intro">
            Contact each supplier about the pieces you've saved. We'll put them
            all in one WhatsApp message for you.
          </p>

          {groups.map(({ supplier, items }) => (
            <section className="saved-group" key={supplier.id}>
              <div className="saved-group-head">
                <div>
                  <h2>{supplier.name}</h2>
                  <p className="saved-location">{supplier.location}</p>
                </div>
                <div className="saved-contact">
                  <a
                    className="btn-solid-dark"
                    href={whatsappLink(
                      supplier.whatsapp,
                      buildMessage(supplier, items),
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp about {items.length}{" "}
                    {items.length === 1 ? "item" : "items"}
                  </a>
                  <a
                    className="btn-outline-dark"
                    href={toTelLink(supplier.phone)}
                  >
                    Call
                  </a>
                </div>
              </div>

              {items.map((product) => (
                <div className="saved-item" key={product.id}>
                  <Link
                    to={`/products/${product.slug}`}
                    className="saved-thumb"
                  >
                    <ProductImage file={product.images[0]} alt={product.name} />
                  </Link>
                  <div className="saved-item-info">
                    <Link to={`/products/${product.slug}`}>
                      <h3>{product.name}</h3>
                    </Link>
                    <p>{formatPrice(product.priceFrom, product.priceTo)}</p>
                  </div>
                  <button
                    className="saved-remove"
                    onClick={() => remove(product.id)}
                    aria-label={`Remove ${product.name} from your enquiry list`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </section>
          ))}

          {missing > 0 && (
            <p className="saved-note">
              {missing} saved {missing === 1 ? "item is" : "items are"} no
              longer listed and {missing === 1 ? "isn't" : "aren't"} shown here.
            </p>
          )}

          <button className="saved-clear" onClick={clear}>
            Clear my list
          </button>
          <p className="saved-note">
            Your list is kept on this device only. If you clear your browser
            data or switch phones, it won't come with you.
          </p>
        </>
      )}
    </div>
  );
}

export default Saved;
