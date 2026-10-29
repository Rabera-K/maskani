import { createContext, useContext, useEffect, useState } from "react";
import { fetchApprovedProducts, fetchCategories } from "./api";

const ProductsContext = createContext({
  products: [],
  categories: [],
  loading: true,
  error: "",
});

export function ProductsProvider({ children }) {
  const [state, setState] = useState({
    products: [],
    categories: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchApprovedProducts(), fetchCategories()])
      .then(([products, categories]) => {
        if (!cancelled)
          setState({ products, categories, loading: false, error: "" });
      })
      .catch((err) => {
        console.error("Products failed to load:", err);
        if (!cancelled) {
          setState({
            products: [],
            categories: [],
            loading: false,
            error:
              "We could not load the products. Please refresh and try again.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProductsContext.Provider value={state}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
