import { createContext } from "react";

export const SavedContext = createContext({
  ids: [],
  isSaved: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
});
