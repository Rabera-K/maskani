import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { availabilityLabels } from "../../utils";
import { useProducts } from "../../ProductsContext";

function photoUrl(path) {
  return supabase.storage.from("listing-images").getPublicUrl(path).data
    .publicUrl;
}

function toForm(s) {
  return {
    product_name: s.product_name,
    category: s.category,
    description: s.description,
    price_from: s.price_from ?? "",
    price_to: s.price_to ?? "",
    availability: s.availability ?? "",
    dimensions: s.dimensions ?? "",
    materials: s.materials ?? "",
    colours: s.colours ?? "",
    business_name: s.business_name,
    location: s.location,
    phone: s.phone,
    whatsapp: s.whatsapp ?? "",
  };
}

function TextField({ label, name, form, onChange, type = "text" }) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={`${name}-${form.id}`}>
        {label}
      </label>
      <input
        id={`${name}-${form.id}`}
        name={name}
        type={type}
        className="field-input"
        value={form[name]}
        onChange={onChange}
      />
    </div>
  );
}

function SubmissionCard({ submission, onDone }) {
  const [form, setForm] = useState({
    ...toForm(submission),
    id: submission.id,
  });
  const [featured, setFeatured] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { categories } = useProducts();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  }

  function buildUpdate() {
    return {
      product_name: form.product_name.trim(),
      category: form.category,
      description: form.description.trim(),
      price_from: form.price_from === "" ? null : Number(form.price_from),
      price_to: form.price_to === "" ? null : Number(form.price_to),
      availability: form.availability || null,
      dimensions: form.dimensions.trim() || null,
      materials: form.materials.trim() || null,
      colours: form.colours.trim() || null,
      business_name: form.business_name.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim() || null,
    };
  }

  async function saveChanges() {
    const { error } = await supabase
      .from("submissions")
      .update(buildUpdate())
      .eq("id", submission.id);
    return error;
  }

  async function handleSave() {
    setBusy(true);
    setError("");
    const saveError = await saveChanges();
    if (saveError) setError(saveError.message);
    else setMessage("Changes saved.");
    setBusy(false);
  }

  async function handleApprove() {
    setBusy(true);
    setError("");

    const saveError = await saveChanges();
    if (saveError) {
      setError(saveError.message);
      setBusy(false);
      return;
    }

    const { data: productId, error: approveError } = await supabase.rpc(
      "approve_submission",
      { submission_id: submission.id, make_featured: featured },
    );
    if (approveError) {
      setError(approveError.message);
      setBusy(false);
      return;
    }

    const { data: product } = await supabase
      .from("products")
      .select("slug")
      .eq("id", productId)
      .single();

    onDone(submission.id, `Published “${form.product_name}”.`, product?.slug);
  }

  async function handleReject() {
    if (!window.confirm("Reject this submission?")) return;
    setBusy(true);
    setError("");

    const { error } = await supabase
      .from("submissions")
      .update({ status: "rejected", admin_notes: note.trim() || null })
      .eq("id", submission.id);

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    onDone(submission.id, `Rejected “${form.product_name}”.`);
  }

  return (
    <article className="admin-card">
      <p className="admin-date">
        Submitted {new Date(submission.created_at).toLocaleString("en-KE")}
      </p>

      <div className="admin-photos">
        {submission.image_paths.map((path) => (
          <a key={path} href={photoUrl(path)} target="_blank" rel="noreferrer">
            <img src={photoUrl(path)} alt="Submitted product" />
          </a>
        ))}
      </div>

      <div className="admin-grid">
        <TextField
          label="Product name"
          name="product_name"
          form={form}
          onChange={handleChange}
        />

        <div className="field">
          <label className="field-label" htmlFor={`category-${form.id}`}>
            Category
          </label>
          <select
            id={`category-${form.id}`}
            name="category"
            className="field-input"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <TextField
          label="Price from (KES, blank = on request)"
          name="price_from"
          type="number"
          form={form}
          onChange={handleChange}
        />
        <TextField
          label="Price to (KES, optional)"
          name="price_to"
          type="number"
          form={form}
          onChange={handleChange}
        />

        <div className="field">
          <label className="field-label" htmlFor={`availability-${form.id}`}>
            Availability
          </label>
          <select
            id={`availability-${form.id}`}
            name="availability"
            className="field-input"
            value={form.availability}
            onChange={handleChange}
          >
            <option value="">Not stated</option>
            {Object.entries(availabilityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <TextField
          label="Dimensions"
          name="dimensions"
          form={form}
          onChange={handleChange}
        />
        <TextField
          label="Materials"
          name="materials"
          form={form}
          onChange={handleChange}
        />
        <TextField
          label="Colours"
          name="colours"
          form={form}
          onChange={handleChange}
        />
        <TextField
          label="Business name"
          name="business_name"
          form={form}
          onChange={handleChange}
        />
        <TextField
          label="Location"
          name="location"
          form={form}
          onChange={handleChange}
        />
        <TextField
          label="Phone"
          name="phone"
          form={form}
          onChange={handleChange}
        />
        <TextField
          label="WhatsApp"
          name="whatsapp"
          form={form}
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={`description-${form.id}`}>
          Description
        </label>
        <textarea
          id={`description-${form.id}`}
          name="description"
          rows="4"
          className="field-input"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <label className="admin-check">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Feature on the home page
      </label>

      <div className="admin-actions">
        <button className="admin-btn" onClick={handleApprove} disabled={busy}>
          Approve and publish
        </button>
        <button
          className="admin-btn admin-btn-outline"
          onClick={handleSave}
          disabled={busy}
        >
          Save changes
        </button>
      </div>

      <div className="field admin-reject">
        <label className="field-label" htmlFor={`note-${form.id}`}>
          Rejection note (private)
        </label>
        <input
          id={`note-${form.id}`}
          className="field-input"
          placeholder="For your own records"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          className="admin-btn admin-btn-danger"
          onClick={handleReject}
          disabled={busy}
        >
          Reject
        </button>
      </div>

      {message && <p className="admin-ok">{message}</p>}
      {error && <p className="field-error">{error}</p>}
    </article>
  );
}

export default SubmissionCard;
