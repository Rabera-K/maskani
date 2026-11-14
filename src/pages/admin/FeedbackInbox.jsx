import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

function FeedbackInbox() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setRows(data);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleResolved(row) {
    const { error } = await supabase
      .from("feedback")
      .update({ resolved: !row.resolved })
      .eq("id", row.id);
    if (error) setError(error.message);
    else
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id ? { ...r, resolved: !r.resolved } : r,
        ),
      );
  }

  async function remove(row) {
    if (!window.confirm("Delete this feedback permanently?")) return;
    const { error } = await supabase.from("feedback").delete().eq("id", row.id);
    if (error) setError(error.message);
    else setRows((prev) => prev.filter((r) => r.id !== row.id));
  }

  const shown = rows ? rows.filter((r) => showResolved || !r.resolved) : null;

  return (
    <section>
      <h1>Feedback</h1>

      <label className="admin-check">
        <input
          type="checkbox"
          checked={showResolved}
          onChange={(e) => setShowResolved(e.target.checked)}
        />
        Show resolved
      </label>

      {error && <p className="field-error">{error}</p>}
      {!rows && !error && <p>Loading…</p>}
      {shown && shown.length === 0 && <p>No feedback to show.</p>}

      {shown &&
        shown.map((row) => (
          <article className="admin-card" key={row.id}>
            <p className="admin-date">
              {new Date(row.created_at).toLocaleString("en-KE")} · {row.role}
              {row.found && ` · found what they wanted: ${row.found}`}
              {row.page && ` · from ${row.page}`}
            </p>
            <p>{row.message}</p>
            {row.contact && (
              <p className="admin-date">Contact: {row.contact}</p>
            )}
            <div className="admin-actions">
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => toggleResolved(row)}
              >
                {row.resolved ? "Mark unresolved" : "Mark resolved"}
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => remove(row)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
    </section>
  );
}

export default FeedbackInbox;
