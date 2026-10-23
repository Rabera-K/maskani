import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Submit from "./pages/Submit";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Catalogue />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/submit" element={<Submit />} />
    </Routes>
  );
}

export default App;
