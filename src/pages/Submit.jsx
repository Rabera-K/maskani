import { useState } from "react";
import { categories } from "../data/products";
import { availabilityLabels } from "../utils";
import { submitListing } from "../api";
import "./Submit.css";

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;

const emptyForm = {
  productName: "",
  category: "",
  description: "",
  priceType: "exact",
  priceFrom: "",
  priceTo: "",
  availability: "",
  dimensions: "",
  materials: "",
  colours: "",
  businessName: "",
  location: "",
  phone: "",
  whatsapp: "",
  website: "",
};

function isValidKenyanPhone(value) {
  const cleaned = value.replace(/[\s-]/g, "");
  return /^(?:\+254|254|0)[17]\d{8}$/.test(cleaned);
}

function validate(form, images) {
  const errors = {};

  if (!form.productName.trim()) errors.productName = "Enter the product name.";
  if (!form.category) errors.category = "Choose a category.";
  if (form.description.trim().length < 20) {
    errors.description = "Write a short description (at least 20 characters).";
  }

  if (form.priceType === "exact") {
    if (!(Number(form.priceFrom) > 0))
      errors.priceFrom = "Enter the price in KES.";
  }
  if (form.priceType === "range") {
    const from = Number(form.priceFrom);
    const to = Number(form.priceTo);
    if (!(from > 0)) errors.priceFrom = "Enter the lowest price.";
    if (!(to > 0)) errors.priceTo = "Enter the highest price.";
    else if (from > 0 && to <= from) {
      errors.priceTo = "The highest price must be more than the lowest.";
    }
  }

  if (images.length === 0) errors.images = "Add at least one photo.";

  if (!form.businessName.trim())
    errors.businessName = "Enter your business name.";
  if (!form.location.trim())
    errors.location = "Enter your shop or workshop location.";

  if (!form.phone.trim()) errors.phone = "Enter a phone number.";
  else if (!isValidKenyanPhone(form.phone)) {
    errors.phone = "Enter a valid Kenyan number, for example 0712 345 678.";
  }
  if (form.whatsapp.trim() && !isValidKenyanPhone(form.whatsapp)) {
    errors.whatsapp = "Enter a valid Kenyan number, or leave this blank.";
  }

  return errors;
}

function Field({ label, htmlFor, optional, hint, error, children }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {optional && <span className="field-optional"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function Submit() {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [imageProblem, setImageProblem] = useState("");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function clearError(name) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  }

  function handleImages(e) {
    const picked = Array.from(e.target.files);
    const problems = [];
    const accepted = [];

    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        problems.push(`${file.name} is not an image.`);
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        problems.push(`${file.name} is larger than ${MAX_SIZE_MB} MB.`);
      } else {
        accepted.push({ file, preview: URL.createObjectURL(file) });
      }
    }

    const room = MAX_IMAGES - images.length;
    if (accepted.length > room) {
      problems.push(`You can add up to ${MAX_IMAGES} photos.`);
    }

    setImages([...images, ...accepted.slice(0, room)]);
    setImageProblem(problems.join(" "));
    clearError("images");
    e.target.value = ""; // lets the same file be picked again later
  }

  function removeImage(index) {
    URL.revokeObjectURL(images[index].preview);
    setImages(images.filter((_, i) => i !== index));
  }

  function resetForm() {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setForm(emptyForm);
    setImages([]);
    setErrors({});
    setImageProblem("");
    setSubmitError("");
    setSubmitted(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (form.website) {
      setSubmitted(true); // pretend it worked, so bots don't learn anything
      return;
    }

    const found = validate(form, images);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => {
        document.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    const listing = {
      productName: form.productName.trim(),
      category: form.category,
      description: form.description.trim(),
      priceFrom: form.priceType === "request" ? null : Number(form.priceFrom),
      priceTo: form.priceType === "range" ? Number(form.priceTo) : null,
      availability: form.availability || null,
      dimensions: form.dimensions.trim() || null,
      materials: form.materials.trim() || null,
      colours: form.colours.trim() || null,
      businessName: form.businessName.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim() || null,
      images: images.map((img) => img.file),
    };

    setSending(true);
    try {
      await submitListing(listing);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="submit-page">
        <div className="submit-success">
          <p className="eyebrow eyebrow-dark">Submission received</p>
          <h1>Thank you, we've got it.</h1>
          <p>
            The Maskani team will review your product and may edit it for
            clarity before it goes live. We'll contact you on {form.phone} if we
            need anything.
          </p>
          <button className="btn-solid-dark submit-button" onClick={resetForm}>
            Submit another product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page">
      <header className="submit-header">
        <p className="eyebrow eyebrow-dark">For suppliers</p>
        <h1>Submit a product</h1>
        <p>
          Tell us about a piece you sell or make. Every submission is reviewed
          by the Maskani team before it appears in the catalogue. Your business
          name, location and contact details are shown on the listing so buyers
          can reach you.
        </p>
      </header>

      <form className="submit-form" onSubmit={handleSubmit} noValidate>
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={handleChange}
          />
        </div>
        <fieldset>
          <legend>The product</legend>

          <Field
            label="Product name"
            htmlFor="productName"
            error={errors.productName}
          >
            <input
              id="productName"
              name="productName"
              className="field-input"
              value={form.productName}
              onChange={handleChange}
              aria-invalid={!!errors.productName}
            />
          </Field>

          <Field label="Category" htmlFor="category" error={errors.category}>
            <select
              id="category"
              name="category"
              className="field-input"
              value={form.category}
              onChange={handleChange}
              aria-invalid={!!errors.category}
            >
              <option value="">Choose a category</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Short description"
            htmlFor="description"
            hint="What it is, what it's like, who it suits."
            error={errors.description}
          >
            <textarea
              id="description"
              name="description"
              rows="4"
              maxLength="400"
              className="field-input"
              value={form.description}
              onChange={handleChange}
              aria-invalid={!!errors.description}
            />
          </Field>
        </fieldset>

        <fieldset>
          <legend>Price</legend>
          <p className="field-hint price-hint">
            Listings with a price are far more useful to buyers. If you can't
            give one, choose "Price on request" and it will be labelled clearly.
          </p>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="priceType"
                value="exact"
                checked={form.priceType === "exact"}
                onChange={handleChange}
              />
              One price
            </label>
            <label>
              <input
                type="radio"
                name="priceType"
                value="range"
                checked={form.priceType === "range"}
                onChange={handleChange}
              />
              Price range
            </label>
            <label>
              <input
                type="radio"
                name="priceType"
                value="request"
                checked={form.priceType === "request"}
                onChange={handleChange}
              />
              Price on request
            </label>
          </div>

          {form.priceType !== "request" && (
            <div className="field-row">
              <Field
                label={
                  form.priceType === "range"
                    ? "Lowest price (KES)"
                    : "Price (KES)"
                }
                htmlFor="priceFrom"
                error={errors.priceFrom}
              >
                <input
                  id="priceFrom"
                  name="priceFrom"
                  type="number"
                  min="0"
                  className="field-input"
                  value={form.priceFrom}
                  onChange={handleChange}
                  aria-invalid={!!errors.priceFrom}
                />
              </Field>

              {form.priceType === "range" && (
                <Field
                  label="Highest price (KES)"
                  htmlFor="priceTo"
                  error={errors.priceTo}
                >
                  <input
                    id="priceTo"
                    name="priceTo"
                    type="number"
                    min="0"
                    className="field-input"
                    value={form.priceTo}
                    onChange={handleChange}
                    aria-invalid={!!errors.priceTo}
                  />
                </Field>
              )}
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend>Details</legend>

          <Field label="Availability" htmlFor="availability" optional>
            <select
              id="availability"
              name="availability"
              className="field-input"
              value={form.availability}
              onChange={handleChange}
            >
              <option value="">Not sure / varies</option>
              {Object.entries(availabilityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Dimensions"
            htmlFor="dimensions"
            optional
            hint="For example 210 × 90 × 85 cm"
          >
            <input
              id="dimensions"
              name="dimensions"
              className="field-input"
              value={form.dimensions}
              onChange={handleChange}
            />
          </Field>

          <Field
            label="Materials"
            htmlFor="materials"
            optional
            hint="For example velvet, hardwood frame"
          >
            <input
              id="materials"
              name="materials"
              className="field-input"
              value={form.materials}
              onChange={handleChange}
            />
          </Field>

          <Field
            label="Colours"
            htmlFor="colours"
            optional
            hint="List the colours available"
          >
            <input
              id="colours"
              name="colours"
              className="field-input"
              value={form.colours}
              onChange={handleChange}
            />
          </Field>
        </fieldset>

        <fieldset>
          <legend>Photos</legend>

          <Field
            label="Product photos"
            htmlFor="images"
            hint={`Up to ${MAX_IMAGES} photos, ${MAX_SIZE_MB} MB each. Clear, well-lit photos get more enquiries.`}
            error={errors.images}
          >
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="field-input"
              onChange={handleImages}
              aria-invalid={!!errors.images}
            />
          </Field>

          {imageProblem && <p className="field-error">{imageProblem}</p>}

          {images.length > 0 && (
            <div className="preview-grid">
              {images.map((img, index) => (
                <div className="preview" key={img.preview}>
                  <img src={img.preview} alt={`Selected photo ${index + 1}`} />
                  <button
                    type="button"
                    className="preview-remove"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend>Your business</legend>

          <Field
            label="Business name"
            htmlFor="businessName"
            error={errors.businessName}
          >
            <input
              id="businessName"
              name="businessName"
              className="field-input"
              value={form.businessName}
              onChange={handleChange}
              aria-invalid={!!errors.businessName}
            />
          </Field>

          <Field
            label="Shop or workshop location"
            htmlFor="location"
            hint="For example Ngong Road, Nairobi"
            error={errors.location}
          >
            <input
              id="location"
              name="location"
              className="field-input"
              value={form.location}
              onChange={handleChange}
              aria-invalid={!!errors.location}
            />
          </Field>

          <div className="field-row">
            <Field label="Phone number" htmlFor="phone" error={errors.phone}>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="field-input"
                value={form.phone}
                onChange={handleChange}
                aria-invalid={!!errors.phone}
              />
            </Field>

            <Field
              label="WhatsApp number"
              htmlFor="whatsapp"
              optional
              hint="Leave blank if it's the same as your phone."
              error={errors.whatsapp}
            >
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                className="field-input"
                value={form.whatsapp}
                onChange={handleChange}
                aria-invalid={!!errors.whatsapp}
              />
            </Field>
          </div>
        </fieldset>

        {Object.keys(errors).length > 0 && (
          <p className="field-error">
            Please fix the highlighted fields and try again.
          </p>
        )}
        {submitError && <p className="field-error">{submitError}</p>}

        <button
          type="submit"
          className="btn-solid-dark submit-button"
          disabled={sending}
        >
          {sending ? "Sending…" : "Submit for review"}
        </button>
      </form>
    </div>
  );
}

export default Submit;
