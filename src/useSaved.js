import { useContext } from "react";
import { SavedContext } from "./savedContext";

export function useSaved() {
  return useContext(SavedContext);
}
