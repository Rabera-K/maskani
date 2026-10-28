import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Submit from "./pages/Submit";

import { lazy, Suspense } from "react";

const Admin = lazy(() => import("./pages/admin/Admin"));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Catalogue />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/submit" element={<Submit />} />
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={<p style={{ padding: "48px 24px" }}>Loading…</p>}
            >
              <Admin />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
