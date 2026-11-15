import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const REASON_LABELS = {
  wrong_details: "Price or details are wrong",
  not_available: "Item isn’t available",
  misleading: "Misleading or suspicious",
  photos_not_theirs: "Photos or content used without permission",
  offensive: "Offensive or inappropriate",
  other: "Something else",
};

function Reports() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const [notes, setNotes] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else {
          setRows(data);
          setNotes(
            Object.fromEntries(data.map((r) => [r.id, r.admin_notes || ""])),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function update(row, changes) {
    setError("");
    setMessage("");
    const { error } = await supabase
      .from("reports")
      .update(changes)
      .eq("id", row.id);
    if (error) {
      setError(error.message);
      return false;
    }
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, ...changes } : r)),
    );
    return true;
  }

  async function unpublish(row) {
    if (!row.product_id) return;
    const { error } = await supabase
      .from("products")
      .update({ status: "archived" })
      .eq("id", row.product_id);
    if (error) {
      setError(error.message);
      return;
    }
    await update(row, { status: "investigating" });
    setMessage(`“${row.product_name}” is now hidden from the public site.`);
  }

  const shown = rows
    ? rows.filter(
        (r) => showClosed || r.status === "new" || r.status === "investigating",
      )
    : null;

  return (
    <section>
      <h1>Reports</h1>

      <label className="admin-check">
        <input
          type="checkbox"
          checked={showClosed}
          onChange={(e) => setShowClosed(e.target.checked)}
        />
        Show resolved and dismissed
      </label>

      {message && <p className="admin-notice">{message}</p>}
      {error && <p className="field-error">{error}</p>}
      {!rows && !error && <p>Loading…</p>}
      {shown && shown.length === 0 && <p>No reports to show.</p>}

      {shown &&
        shown.map((row) => (
          <article className="admin-card" key={row.id}>
            <p className="admin-date">
              {new Date(row.created_at).toLocaleString("en-KE")} · {row.status}
            </p>
            <p>
              <strong>{REASON_LABELS[row.reason] || row.reason}</strong>
              {" · "}
              {row.product_name} ({row.supplier_name})
            </p>
            <p>{row.details}</p>
            {row.contact && (
              <p className="admin-date">Reporter’s contact: {row.contact}</p>
            )}

            <div className="field">
              <label className="field-label" htmlFor={`rn-${row.id}`}>
                Your notes (private)
              </label>
              <input
                id={`rn-${row.id}`}
                className="field-input"
                value={notes[row.id] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [row.id]: e.target.value }))
                }
                onBlur={() =>
                  update(row, {
                    admin_notes: (notes[row.id] || "").trim() || null,
                  })
                }
              />
            </div>

            <div className="admin-actions">
              {row.product_id && (
                <>
                  <button className="admin-btn" onClick={() => unpublish(row)}>
                    Unpublish listing
                  </button>
                  {/* <Link
                    className="admin-link"
                    to={`/admin`}
                    onClick={(e) => e.preventDefault()}
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{ display: "none" }}
                  /> */}
                </>
              )}
              {row.status === "new" && (
                <button
                  className="admin-btn admin-btn-outline"
                  onClick={() => update(row, { status: "investigating" })}
                >
                  Mark investigating
                </button>
              )}
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => update(row, { status: "resolved" })}
              >
                Resolved
              </button>
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => update(row, { status: "dismissed" })}
              >
                Dismiss
              </button>
            </div>
          </article>
        ))}
    </section>
  );
}

export default Reports;
