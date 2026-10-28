import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Login from "./Login";
import Submissions from "./Submissions";
import Listings from "./Listings";
import "./Admin.css";

function Admin() {
  const [session, setSession] = useState(undefined); // undefined = still checking
  const [adminCheck, setAdminCheck] = useState({ userId: null, ok: false });
  const [tab, setTab] = useState("submissions");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;
    supabase.rpc("is_admin").then(({ data }) => {
      setAdminCheck({ userId, ok: Boolean(data) });
    });
  }, [userId]);

  const checked = userId && adminCheck.userId === userId;

  if (session === undefined) {
    return (
      <div className="admin">
        <p>Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  if (!checked) {
    return (
      <div className="admin">
        <p>Checking access…</p>
      </div>
    );
  }

  if (!adminCheck.ok) {
    return (
      <div className="admin">
        <h1>No access</h1>
        <p>This account is not an administrator.</p>
        <button className="admin-btn" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-bar">
        <span>Signed in as {session.user.email}</span>
        <button
          className="admin-btn admin-btn-outline"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </button>
      </div>
      <div className="admin-tabs">
        <button
          className={tab === "submissions" ? "active" : ""}
          onClick={() => setTab("submissions")}
        >
          Submissions
        </button>
        <button
          className={tab === "listings" ? "active" : ""}
          onClick={() => setTab("listings")}
        >
          Listings
        </button>
      </div>

      {tab === "submissions" ? <Submissions /> : <Listings />}
    </div>
  );
}

export default Admin;
