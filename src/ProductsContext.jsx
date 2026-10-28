import { createContext, useContext, useEffect, useState } from "react";
import { fetchApprovedProducts } from "./api";

const ProductsContext = createContext({
  products: [],
  loading: true,
  error: "",
});

export function ProductsProvider({ children }) {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    fetchApprovedProducts()
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: "" });
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            products: [],
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
