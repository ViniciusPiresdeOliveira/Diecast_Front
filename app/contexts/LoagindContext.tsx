"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface LoadingContextData {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextData | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };
  return (
    <LoadingContext.Provider
      value={{
        loading,
        showLoading,
        hideLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading deve ser usado dentro de LoadingProvider");
  }

  return context;
}
