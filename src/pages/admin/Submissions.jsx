import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import SubmissionCard from "./SubmissionCard";

function Submissions() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("submissions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setRows(data);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleDone(id, text, slug) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setNotice({ text, slug });
    window.scrollTo(0, 0);
  }

  return (
    <section>
      <h1>Pending submissions</h1>

      {notice && (
        <p className="admin-notice">
          {notice.text}{" "}
          {notice.slug && (
            <Link to={`/products/${notice.slug}`}>View listing →</Link>
          )}
        </p>
      )}

      {error && <p className="field-error">{error}</p>}
      {!rows && !error && <p>Loading…</p>}
      {rows && rows.length === 0 && <p>Nothing waiting for review.</p>}

      {rows &&
        rows.map((row) => (
          <SubmissionCard key={row.id} submission={row} onDone={handleDone} />
        ))}
    </section>
  );
}

export default Submissions;
