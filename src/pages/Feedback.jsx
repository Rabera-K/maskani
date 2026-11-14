import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { submitFeedback } from "../api";
import "./Feedback.css";

function Feedback() {
  const [params] = useSearchParams();
  const from = (params.get("from") || "").slice(0, 200);

  const [role, setRole] = useState("");
  const [found, setFound] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // hidden spam trap
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (website) {
      setDone(true); // a bot: pretend it worked
      return;
    }
    if (!role) {
      setError("Please tell us whether you are a buyer, a supplier, or other.");
      return;
    }
    if (message.trim().length < 5) {
      setError("Please write a few words about your experience.");
      return;
    }

    setSending(true);
    try {
      await submitFeedback({
        role,
        found: role === "buyer" && found ? found : null,
        message: message.trim().slice(0, 1000),
        contact: contact.trim().slice(0, 100) || null,
        page: from || null,
      });
      setDone(true);
      window.scrollTo(0, 0);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="feedback">
        <h1>Thank you.</h1>
        <p>
          Your feedback has been received. It helps us make Maskani better for
          everyone.
        </p>
        <Link to="/" className="btn-solid-dark feedback-back">
          Back to the home page
        </Link>
      </div>
    );
  }

  return (
    <div className="feedback">
      <h1>Tell us what you think</h1>
      <p className="feedback-intro">
        Maskani is new, and honest feedback shapes what we build next. It takes
        about a minute.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="fb-website">Leave this field empty</label>
          <input
            id="fb-website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <fieldset className="feedback-group">
          <legend className="field-label">I am a…</legend>
          <div className="radio-group">
            {[
              ["buyer", "Buyer"],
              ["supplier", "Supplier"],
              ["other", "Other"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={role === value}
                  onChange={(e) => setRole(e.target.value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {role === "buyer" && (
          <fieldset className="feedback-group">
            <legend className="field-label">
              Did you find what you were looking for?
            </legend>
            <div className="radio-group">
              {[
                ["yes", "Yes"],
                ["partly", "Partly"],
                ["no", "No"],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="found"
                    value={value}
                    checked={found === value}
                    onChange={(e) => setFound(e.target.value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="field">
          <label className="field-label" htmlFor="fb-message">
            What worked, what was confusing, or what is missing?
          </label>
          <textarea
            id="fb-message"
            rows="5"
            maxLength="1000"
            className="field-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="fb-contact">
            Phone or email <span className="field-optional">(optional)</span>
          </label>
          <input
            id="fb-contact"
            maxLength="100"
            className="field-input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <p className="field-hint">Only if you’d like us to reply.</p>
        </div>

        {error && <p className="field-error">{error}</p>}

        <button
          type="submit"
          className="btn-solid-dark feedback-submit"
          disabled={sending}
        >
          {sending ? "Sending…" : "Send feedback"}
        </button>
      </form>
    </div>
  );
}

export default Feedback;
