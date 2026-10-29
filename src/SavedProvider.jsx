import { useEffect, useState } from "react";
import { SavedContext } from "./savedContext";

const KEY = "maskani-saved";

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((x) => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export function SavedProvider({ children }) {
  const [ids, setIds] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      // storage can be blocked (private mode); the list then lasts for this visit only
    }
  }, [ids]);

  const value = {
    ids,
    isSaved: (id) => ids.includes(id),
    toggle: (id) =>
      setIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      ),
    remove: (id) => setIds((prev) => prev.filter((x) => x !== id)),
    clear: () => setIds([]),
  };

  return (
    <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
  );
}
