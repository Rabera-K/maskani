import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProducts } from "../ProductsContext";
import { submitReport } from "../api";
import "./Report.css";

const REASONS = [
  ["wrong_details", "The price or details are wrong"],
  ["not_available", "The item isn’t available"],
  ["misleading", "The listing is misleading or looks suspicious"],
  ["photos_not_theirs", "Photos or content used without permission"],
  ["offensive", "Offensive or inappropriate"],
  ["other", "Something else"],
];

function Report() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const product = products.find((p) => p.slug === slug);

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // hidden spam trap
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  if (loading)
    return (
      <div className="report">
        <p>Loading…</p>
      </div>
    );

  if (!product) {
    return (
      <div className="report">
        <h1>Listing not found</h1>
        <p>It may have been removed already.</p>
        <Link to="/products" className="btn-solid-dark report-back">
          Browse products
        </Link>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (website) {
      setDone(true); // a bot: pretend it worked
      return;
    }
    if (!reason) {
      setError("Please choose what’s wrong.");
      return;
    }
    if (details.trim().length < 5) {
      setError("Please add a few words so we can look into it.");
      return;
    }

    setSending(true);
    try {
      await submitReport({
        product_id: product.id,
        product_name: product.name,
        supplier_name: product.supplier.name,
        reason,
        details: details.trim().slice(0, 1000),
        contact: contact.trim().slice(0, 100) || null,
      });
      setDone(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="report">
        <h1>Thank you.</h1>
        <p>
          We’ve received your report and will look into it. If you left contact
          details, we may get in touch.
        </p>
        <Link to="/products" className="btn-solid-dark report-back">
          Back to the catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="report">
      <h1>Report this listing</h1>
      <p className="report-product">
        <strong>{product.name}</strong> from {product.supplier.name}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="rp-website">Leave this field empty</label>
          <input
            id="rp-website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <fieldset className="report-group">
          <legend className="field-label">What’s the problem?</legend>
          {REASONS.map(([value, label]) => (
            <label key={value} className="report-option">
              <input
                type="radio"
                name="reason"
                value={value}
                checked={reason === value}
                onChange={(e) => setReason(e.target.value)}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <div className="field">
          <label className="field-label" htmlFor="rp-details">
            Tell us more
          </label>
          <textarea
            id="rp-details"
            rows="5"
            maxLength="1000"
            className="field-input"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="rp-contact">
            Phone or email <span className="field-optional">(optional)</span>
          </label>
          <input
            id="rp-contact"
            maxLength="100"
            className="field-input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <p className="field-hint">
            Only if you’d like us to follow up. If the photos are yours, please
            leave contact details so we can confirm.
          </p>
        </div>

        {error && <p className="field-error">{error}</p>}

        <button
          type="submit"
          className="btn-solid-dark report-submit"
          disabled={sending}
        >
          {sending ? "Sending…" : "Send report"}
        </button>
      </form>
    </div>
  );
}

export default Report;
