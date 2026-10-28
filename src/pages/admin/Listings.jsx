import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { formatPrice } from "../../utils";
import ListingEditor from "./ListingEditor";

function Listings() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("products")
      .select("*, supplier:suppliers(*)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setRows(data);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function setStatus(row, status) {
    setBusyId(row.id);
    setError("");

    const { error } = await supabase
      .from("products")
      .update({ status })
      .eq("id", row.id);

    if (error) setError(error.message);
    else
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status } : r)),
      );
    setBusyId(null);
  }

  async function remove(row) {
    const ok = window.confirm(
      `Permanently delete “${row.name}”? Its photos will be deleted too. This cannot be undone.`,
    );
    if (!ok) return;

    setBusyId(row.id);
    setError("");

    const { error } = await supabase.from("products").delete().eq("id", row.id);
    if (error) {
      setError(error.message);
      setBusyId(null);
      return;
    }

    // photos uploaded through the form live in Storage (their paths contain a "/")
    const stored = row.images.filter((path) => path.includes("/"));
    if (stored.length > 0) {
      await supabase.storage.from("listing-images").remove(stored);
    }

    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setBusyId(null);
  }

  const shown = rows
    ? rows.filter((r) => filter === "all" || r.status === filter)
    : null;

  return (
    <section>
      <h1>Listings</h1>

      <div className="field admin-filter">
        <label className="field-label" htmlFor="status-filter">
          Show
        </label>
        <select
          id="status-filter"
          className="field-input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All listings</option>
          <option value="approved">Live (approved)</option>
          <option value="pending">Pending / needs checking</option>
          <option value="archived">Unpublished (archived)</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && <p className="field-error">{error}</p>}
      {!rows && !error && <p>Loading…</p>}
      {rows && shown.length === 0 && <p>No listings match this filter.</p>}

      {shown &&
        shown.map((row) => (
          <article className="admin-row" key={row.id}>
            <div className="admin-row-main">
              <div className="admin-row-info">
                <p className="admin-row-name">{row.name}</p>
                <p className="admin-row-meta">
                  {row.supplier?.name} ·{" "}
                  {formatPrice(row.price_from, row.price_to)}
                </p>
                <span className={`admin-status admin-status-${row.status}`}>
                  {row.status}
                </span>
              </div>

              <div className="admin-row-actions">
                {row.status === "approved" && (
                  <>
                    <Link className="admin-link" to={`/products/${row.slug}`}>
                      View
                    </Link>
                    <button
                      className="admin-btn admin-btn-outline"
                      disabled={busyId === row.id}
                      onClick={() => setStatus(row, "archived")}
                    >
                      Unpublish
                    </button>
                  </>
                )}

                {row.status !== "approved" && (
                  <button
                    className="admin-btn admin-btn-outline"
                    disabled={busyId === row.id}
                    onClick={() => setStatus(row, "approved")}
                  >
                    {row.status === "archived" ? "Republish" : "Publish"}
                  </button>
                )}

                <button
                  className="admin-btn admin-btn-outline"
                  onClick={() =>
                    setEditingId(editingId === row.id ? null : row.id)
                  }
                >
                  {editingId === row.id ? "Close" : "Edit"}
                </button>

                <button
                  className="admin-btn admin-btn-danger"
                  disabled={busyId === row.id}
                  onClick={() => remove(row)}
                >
                  Delete
                </button>
              </div>
            </div>

            {editingId === row.id && (
              <ListingEditor
                row={row}
                onSaved={() => setReloadKey((k) => k + 1)}
                onClose={() => setEditingId(null)}
              />
            )}
          </article>
        ))}
    </section>
  );
}

export default Listings;
