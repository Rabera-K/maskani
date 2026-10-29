import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProductsProvider } from "./ProductsContext";
import { SavedProvider } from "./SavedProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <SavedProvider>
          <App />
        </SavedProvider>
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>,
);
