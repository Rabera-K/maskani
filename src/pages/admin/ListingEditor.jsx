import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { categories } from "../../data/products";
import { availabilityLabels } from "../../utils";

const PHONE = /^0[17]\d{8}$/;
const WHATSAPP = /^254[17]\d{8}$/;
const NO_MESSAGE = { type: "", text: "" };

function Field({ label, id, hint, children }) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function Message({ message }) {
  if (!message.text) return null;
  return (
    <p className={message.type === "error" ? "field-error" : "admin-ok"}>
      {message.text}
    </p>
  );
}

function ListingEditor({ row, onSaved, onClose }) {
  const s = row.supplier;

  const [p, setP] = useState({
    name: row.name,
    category: row.category,
    description: row.description,
    price_from: row.price_from ?? "",
    price_to: row.price_to ?? "",
    availability: row.availability ?? "",
    dimensions: row.dimensions ?? "",
    materials: row.materials ?? "",
    colours: row.colours ?? "",
    featured: row.featured,
  });

  const [sup, setSup] = useState({
    name: s.name,
    location: s.location,
    phone: s.phone,
    whatsapp: s.whatsapp ?? "",
    summary: s.summary ?? "",
    phone_confirmed: s.phone_confirmed,
    premises_visited: s.premises_visited,
    customer_reviews: s.customer_reviews,
  });

  const [productMsg, setProductMsg] = useState(NO_MESSAGE);
  const [supplierMsg, setSupplierMsg] = useState(NO_MESSAGE);
  const [busy, setBusy] = useState(false);

  function changeProduct(e) {
    const { name, value, type, checked } = e.target;
    setP((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setProductMsg(NO_MESSAGE);
  }

  function changeSupplier(e) {
    const { name, value, type, checked } = e.target;
    setSup((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSupplierMsg(NO_MESSAGE);
  }

  async function saveProduct() {
    const from = p.price_from === "" ? null : Number(p.price_from);
    const to = p.price_to === "" ? null : Number(p.price_to);

    let problem = "";
    if (!p.name.trim()) problem = "Enter the product name.";
    else if (!p.description.trim()) problem = "Enter a description.";
    else if (from === null && to !== null)
      problem = "Add a lowest price, or clear the highest price.";
    else if (from !== null && !(from > 0))
      problem = "Prices must be more than zero.";
    else if (to !== null && !(to > from))
      problem = "The highest price must be more than the lowest.";

    if (problem) {
      setProductMsg({ type: "error", text: problem });
      return;
    }

    setBusy(true);
    const { error } = await supabase
      .from("products")
      .update({
        name: p.name.trim(),
        category: p.category,
        description: p.description.trim(),
        price_from: from,
        price_to: to,
        availability: p.availability || null,
        dimensions: p.dimensions.trim() || null,
        materials: p.materials.trim() || null,
        colours: p.colours.trim() || null,
        featured: p.featured,
      })
      .eq("id", row.id);
    setBusy(false);

    if (error) {
      setProductMsg({ type: "error", text: error.message });
    } else {
      setProductMsg({ type: "ok", text: "Product saved." });
      onSaved();
    }
  }

  async function saveSupplier() {
    const phone = sup.phone.replace(/[\s-]/g, "");
    const whatsapp = sup.whatsapp.replace(/[\s-]/g, "");

    let problem = "";
    if (!sup.name.trim()) problem = "Enter the business name.";
    else if (!sup.location.trim()) problem = "Enter the location.";
    else if (!PHONE.test(phone)) problem = "Phone must look like 0712345678.";
    else if (!WHATSAPP.test(whatsapp))
      problem = "WhatsApp must look like 254712345678 (no + sign).";

    if (problem) {
      setSupplierMsg({ type: "error", text: problem });
      return;
    }

    setBusy(true);
    const { error } = await supabase
      .from("suppliers")
      .update({
        name: sup.name.trim(),
        location: sup.location.trim(),
        phone,
        whatsapp,
        summary: sup.summary.trim() || null,
        phone_confirmed: sup.phone_confirmed,
        premises_visited: sup.premises_visited,
        customer_reviews: sup.customer_reviews,
      })
      .eq("id", s.id);
    setBusy(false);

    if (error) {
      setSupplierMsg({ type: "error", text: error.message });
    } else {
      setSupplierMsg({ type: "ok", text: "Supplier saved." });
      onSaved();
    }
  }

  const willBeVerified =
    sup.phone_confirmed && sup.premises_visited && sup.customer_reviews;
  const id = (name) => `${name}-${row.id}`;

  return (
    <div className="admin-editor">
      <h3>Product</h3>
      <p className="field-hint">
        Web address: /products/{row.slug} (this can't be changed, so shared
        links keep working).
      </p>

      <div className="admin-grid">
        <Field label="Name" id={id("p-name")}>
          <input
            id={id("p-name")}
            name="name"
            className="field-input"
            value={p.name}
            onChange={changeProduct}
          />
        </Field>

        <Field label="Category" id={id("p-category")}>
          <select
            id={id("p-category")}
            name="category"
            className="field-input"
            value={p.category}
            onChange={changeProduct}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Price from (KES)"
          id={id("p-from")}
          hint="Leave blank for “price on request”."
        >
          <input
            id={id("p-from")}
            name="price_from"
            type="number"
            min="0"
            className="field-input"
            value={p.price_from}
            onChange={changeProduct}
          />
        </Field>

        <Field
          label="Price to (KES)"
          id={id("p-to")}
          hint="Optional, for a price range."
        >
          <input
            id={id("p-to")}
            name="price_to"
            type="number"
            min="0"
            className="field-input"
            value={p.price_to}
            onChange={changeProduct}
          />
        </Field>

        <Field label="Availability" id={id("p-avail")}>
          <select
            id={id("p-avail")}
            name="availability"
            className="field-input"
            value={p.availability}
            onChange={changeProduct}
          >
            <option value="">Not stated</option>
            {Object.entries(availabilityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Dimensions" id={id("p-dim")}>
          <input
            id={id("p-dim")}
            name="dimensions"
            className="field-input"
            value={p.dimensions}
            onChange={changeProduct}
          />
        </Field>

        <Field label="Materials" id={id("p-mat")}>
          <input
            id={id("p-mat")}
            name="materials"
            className="field-input"
            value={p.materials}
            onChange={changeProduct}
          />
        </Field>

        <Field label="Colours" id={id("p-col")}>
          <input
            id={id("p-col")}
            name="colours"
            className="field-input"
            value={p.colours}
            onChange={changeProduct}
          />
        </Field>
      </div>

      <Field label="Description" id={id("p-desc")}>
        <textarea
          id={id("p-desc")}
          name="description"
          rows="4"
          className="field-input"
          value={p.description}
          onChange={changeProduct}
        />
      </Field>

      <label className="admin-check">
        <input
          type="checkbox"
          name="featured"
          checked={p.featured}
          onChange={changeProduct}
        />
        Feature on the home page
      </label>

      <button className="admin-btn" disabled={busy} onClick={saveProduct}>
        Save product
      </button>
      <Message message={productMsg} />
      <p className="field-hint">Photos can't be changed from here yet.</p>

      <h3 className="admin-editor-gap">Supplier</h3>
      <p className="field-hint">
        These details are shared by all of this supplier's listings, so a change
        here updates every one of them.
      </p>

      <div className="admin-grid">
        <Field label="Business name" id={id("s-name")}>
          <input
            id={id("s-name")}
            name="name"
            className="field-input"
            value={sup.name}
            onChange={changeSupplier}
          />
        </Field>

        <Field label="Location" id={id("s-loc")}>
          <input
            id={id("s-loc")}
            name="location"
            className="field-input"
            value={sup.location}
            onChange={changeSupplier}
          />
        </Field>

        <Field label="Phone" id={id("s-phone")} hint="Format: 0712345678">
          <input
            id={id("s-phone")}
            name="phone"
            className="field-input"
            value={sup.phone}
            onChange={changeSupplier}
          />
        </Field>

        <Field label="WhatsApp" id={id("s-wa")} hint="Format: 254712345678">
          <input
            id={id("s-wa")}
            name="whatsapp"
            className="field-input"
            value={sup.whatsapp}
            onChange={changeSupplier}
          />
        </Field>
      </div>

      <Field label="Short summary" id={id("s-sum")}>
        <input
          id={id("s-sum")}
          name="summary"
          className="field-input"
          value={sup.summary}
          onChange={changeSupplier}
        />
      </Field>

      <p className="field-label">Verification checks</p>
      <label className="admin-check">
        <input
          type="checkbox"
          name="phone_confirmed"
          checked={sup.phone_confirmed}
          onChange={changeSupplier}
        />
        Phone number confirmed
      </label>
      <label className="admin-check">
        <input
          type="checkbox"
          name="premises_visited"
          checked={sup.premises_visited}
          onChange={changeSupplier}
        />
        Premises visited
      </label>
      <label className="admin-check">
        <input
          type="checkbox"
          name="customer_reviews"
          checked={sup.customer_reviews}
          onChange={changeSupplier}
        />
        Customer reviews received
      </label>
      <p className="field-hint">
        {willBeVerified
          ? "All three checks done: this supplier will show the Verified badge."
          : "The Verified badge appears only when all three are ticked."}
      </p>

      <button className="admin-btn" disabled={busy} onClick={saveSupplier}>
        Save supplier
      </button>
      <Message message={supplierMsg} />

      <div className="admin-editor-close">
        <button className="admin-btn admin-btn-outline" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ListingEditor;
